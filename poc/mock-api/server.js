/**
 * server.js — RICS POC Mock API Server (完全版)
 * ソース(rics-back)の全エンドポイントに対応
 * メール送信・帳票生成は除外（軽量化）
 */
const express = require('express');
const cors    = require('cors');
const jwt     = require('jsonwebtoken');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const db      = require('./db');

const app  = express();
const PORT = 8080;
const JWT_SECRET  = 'poc-secret-key-rics-2024';
const JWT_EXPIRES = '8h';
const REFRESH_THRESHOLD = 15 * 60;

app.use(cors({ origin: '*', exposedHeaders: ['X-Refreshed-Token'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: path.join(__dirname, 'uploads/') });
fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });

// ==================== ヘルパー ====================
const genId = (prefix='INQ') => {
  const ts  = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2,6).toUpperCase();
  return `${prefix}-${ts}-${rnd}`;
};
const nowStr = () => new Date().toISOString().replace('T',' ').slice(0,19);

const ok      = (res, data)                     => res.json({ success:true, data, message:null });
const okPage  = (res, records, total, page, size) =>
  res.json({ success:true, data:{ records, total, size, current:page, pages:Math.ceil(total/size)||1 }, message:null });
const fail    = (res, msg, status=400)          => res.status(status).json({ success:false, data:null, message:msg });

// JWT 認証
const auth = (req, res, next) => {
  const header = req.headers['authorization'] || '';
  const token  = header.replace('Bearer ','').trim();
  if (!token) return fail(res,'認証が必要です',401);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    const remaining = decoded.exp - Math.floor(Date.now()/1000);
    if (remaining < REFRESH_THRESHOLD) {
      const newToken = jwt.sign({email:decoded.email,role:decoded.role,name:decoded.name}, JWT_SECRET, {expiresIn:JWT_EXPIRES});
      res.setHeader('X-Refreshed-Token', newToken);
    }
    next();
  } catch(e) { return fail(res,'トークンが無効です',401); }
};

const r = express.Router();

// ================================================================
// 認証
// ================================================================
r.post('/auth/login', (req, res) => {
  const {email, password} = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  if (!user || user.password !== password) return fail(res,'メールアドレスまたはパスワードが正しくありません',401);
  const token = jwt.sign({email:user.email,role:user.role,name:user.full_name,userType:user.user_type}, JWT_SECRET, {expiresIn:JWT_EXPIRES});
  ok(res, {token, expiresIn:28800, userInfo:{name:user.full_name, email:user.email, role:user.role, userType:user.user_type}});
});

r.post('/auth/logout', auth, (req,res) => ok(res,{message:'ログアウトしました'}));

r.post('/auth/pwd/modify', auth, (req,res) => {
  const {oldPassword, newPassword} = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email=?').get(req.user.email);
  if (!user || user.password !== oldPassword) return fail(res,'現在のパスワードが正しくありません');
  db.prepare('UPDATE users SET password=?,updated_at=CURRENT_TIMESTAMP WHERE email=?').run(newPassword, req.user.email);
  ok(res,null);
});

r.post('/auth/pwd/reset', auth, (req,res) => {
  const {userId} = req.body;
  db.prepare('UPDATE users SET password=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run('password123', userId);
  ok(res,{message:'パスワードをリセットしました（仮: password123）'});
});

// ================================================================
// アプリメニュー
// ================================================================
r.get('/api/sys/app', auth, (req,res) => {
  ok(res, [
    {id:'1', name:'問い合わせ管理',  path:'/apl/aplInquiryMgntList',    icon:'otoiawase',       perm:'W'},
    {id:'2', name:'協力業者管理',    path:'/biz/bizPartnerInfoList',     icon:'bizMaster',       perm:'W'},
    {id:'3', name:'見込み顧客管理',  path:'/pot/potPotentialList',       icon:'potMaster',       perm:'W'},
    {id:'4', name:'施工業者管理',    path:'/pro/proContractorInfoList',  icon:'proMaster_back',  perm:'W'},
    {id:'5', name:'ユーザー管理',    path:'/sys/sysUserList',            icon:'userMaster',      perm:'W'},
    {id:'6', name:'ロール管理',      path:'/sys/sysRoleList',            icon:'roleMaster',      perm:'W'},
  ]);
});

// ================================================================
// コードマスタ
// ================================================================
r.get('/sys/code/mapping/all', auth, (req,res) => {
  const rows = db.prepare('SELECT * FROM sys_code_mapping ORDER BY code_key,sort_order').all();
  const map = {};
  rows.forEach(r => {
    if (!map[r.code_key]) map[r.code_key] = [];
    map[r.code_key].push({value:r.code_value, label:r.label});
  });
  ok(res, map);
});

// ================================================================
// 流入経路マスタ
// ================================================================
r.get('/apl/qryAplInquirySource', auth, (req,res) => {
  ok(res, db.prepare('SELECT * FROM apl_inquiry_source ORDER BY id').all());
});

// ================================================================
// 問い合わせ管理
// ================================================================

// akiconフォームからの受信
r.post('/customerInquiry/akicon', (req,res) => {
  try {
    const data = req.body;
    const id  = genId('INQ');
    const now = nowStr();
    const customerName = data['Q12(1)'] || data['customerName'] || '不明';
    const phone        = data['Q12(3)'] || data['phoneNumber'] || '';
    const email        = data['Q13(1)-2'] || data['Q13(2)-2'] || data['contactEmail'] || '';
    const postalCode   = data['Q11(4)-1'] || '';
    const address      = data['Q11(4)-2'] || '';
    const q5 = parseInt(data['Q5'] || '2');
    const rankMap = {1:'C',2:'C',3:'B',4:'A'};
    const aplRank = rankMap[q5] || 'C';

    db.prepare(`INSERT INTO apl_inquiry_management
      (id,handling_date,handling_status,customer_name,phone_number,contact_email,
       mailing_address,apl_source,apl_rank,report_sts,create_at,update_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`
    ).run(id,now,'01',customerName,phone,email,`〒${postalCode} ${address}`,'AKICON',aplRank,'00',now,now);

    const ins = db.prepare('INSERT OR IGNORE INTO apl_inquiry_master (id,inquiry_id,question_key,answer_val) VALUES (?,?,?,?)');
    Object.entries(data).forEach(([k,v],i) => {
      ins.run(`${id}-M${i}`, id, k, Array.isArray(v)?v.join(','):String(v));
    });
    console.log(`[AKICON] 新規: ${id} / ${customerName}`);
    ok(res, {inquiryId:id, rank:aplRank, message:'受付完了しました'});
  } catch(e) {
    console.error('[AKICON]',e.message);
    fail(res,'エラー: '+e.message);
  }
});

// ページング
r.post('/apl/inquiry_mgnt/page', auth, (req,res) => {
  const {current=1, size=10, data:cond={}} = req.body;
  const offset = (current-1)*size;
  const where = ['1=1']; const params = [];
  if (cond.customerName) { where.push('m.customer_name LIKE ?'); params.push(`%${cond.customerName}%`); }
  if (cond.aplSource)    { where.push('m.apl_source = ?');        params.push(cond.aplSource); }
  if (cond.dateFrom)     { where.push('m.handling_date >= ?');    params.push(cond.dateFrom); }
  if (cond.dateTo)       { where.push('m.handling_date <= ?');    params.push(cond.dateTo); }
  const w = where.join(' AND ');
  const total   = db.prepare(`SELECT COUNT(*) as cnt FROM apl_inquiry_management m WHERE ${w}`).get(...params).cnt;
  const rows    = db.prepare(`SELECT m.*,s.code,s.source FROM apl_inquiry_management m LEFT JOIN apl_inquiry_source s ON m.apl_source=s.code WHERE ${w} ORDER BY m.handling_date DESC LIMIT ? OFFSET ?`).all(...params, size, offset);
  const records = rows.map(r => ({
    aplInquiryMgnt:    toMgntDto(r),
    aplInquirySource:  {id:r.id, code:r.code||'', source:r.source||''},
    aplInquiryMaster:  getMasterMap(r.id),
  }));
  okPage(res, records, total, current, size);
});

// 詳細
r.get('/apl/inquiry_mgnt/:inquiryId', auth, (req,res) => {
  if (req.params.inquiryId === 'regenerate') return next();
  const row = db.prepare('SELECT * FROM apl_inquiry_management WHERE id=?').get(req.params.inquiryId);
  if (!row) return fail(res,'対象データが見つかりません',404);
  const src = db.prepare('SELECT * FROM apl_inquiry_source WHERE code=?').get(row.apl_source)||{};
  const reports = db.prepare('SELECT * FROM apl_report_send WHERE inquiry_id=? ORDER BY create_at DESC').all(req.params.inquiryId);
  const history = db.prepare('SELECT * FROM biz_progress_history WHERE inquiry_id=? ORDER BY action_date DESC').all(req.params.inquiryId);
  ok(res, {
    aplInquiryMgnt:          toMgntDto(row),
    aplInquirySource:         src,
    aplInquiryMaster:         getMasterMap(req.params.inquiryId),
    aplInquiryMasterList:     getMasterList(req.params.inquiryId),
    aplReportSendList:        reports.map(toReportDto),
    bizProgressHistoryList:   history.map(toHistoryDto),
  });
});

// 帳票再生成（POCスキップ）
r.get('/apl/inquiry_mgnt/regenerate/:inquiryId', auth, (req,res) => {
  console.log(`[REPORT] 再生成リクエスト: ${req.params.inquiryId} (POCスキップ)`);
  ok(res,{message:'POCモード: 帳票生成はスキップされました'});
});

// 帳票アップロード後処理（POCスキップ）
r.get('/apl/inquiry_mgnt/handleUpload/:inquiryId/:fileId', auth, (req,res) => {
  ok(res,{message:'POCモード: アップロード後処理スキップ'});
});

// 保存・更新
r.put('/apl/inquiry_mgnt', auth, (req,res) => {
  const dto  = req.body;
  const mgnt = dto.aplInquiryMgnt || {};
  const now  = nowStr();
  if (!mgnt.customerName) return fail(res,'相談者名は必須です');

  const isNew = !mgnt.id || !db.prepare('SELECT 1 FROM apl_inquiry_management WHERE id=?').get(mgnt.id);
  if (isNew) {
    const id = mgnt.id || genId('INQ');
    db.prepare(`INSERT INTO apl_inquiry_management
      (id,handling_date,handling_status,login_email,customer_name,name_furigana,
       current_region,phone_number,contact_email,age,gender,occupation,
       report_recipient_name,report_recipient_email,mailing_address,
       apl_source,apl_rank,report_sts,create_at,update_at)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).run(id,mgnt.handlingDate||now,mgnt.handlingStatus||'01',mgnt.loginEmail||'',
      mgnt.customerName,mgnt.nameFurigana||'',mgnt.currentRegion||'',
      mgnt.phoneNumber||'',mgnt.contactEmail||'',mgnt.age||'',mgnt.gender||'',mgnt.occupation||'',
      mgnt.reportRecipientName||'',mgnt.reportRecipientEmail||'',mgnt.mailingAddress||'',
      mgnt.aplSource||'',mgnt.aplRank||'C',mgnt.reportSts||'00',now,now);
    saveMasterList(id, dto.aplInquiryMasterList);
    saveProgressHistory(id, dto.bizProgressHistoryList);
    saveReportSend(id, dto.aplReportSendList);
    console.log(`[MGNT] 新規: ${id}`);
  } else {
    db.prepare(`UPDATE apl_inquiry_management SET
      handling_date=?,handling_status=?,login_email=?,
      customer_name=?,name_furigana=?,current_region=?,
      phone_number=?,contact_email=?,age=?,gender=?,occupation=?,
      report_recipient_name=?,report_recipient_email=?,mailing_address=?,
      apl_source=?,apl_rank=?,report_sts=?,update_at=? WHERE id=?`
    ).run(mgnt.handlingDate||now,mgnt.handlingStatus||'01',mgnt.loginEmail||'',
      mgnt.customerName,mgnt.nameFurigana||'',mgnt.currentRegion||'',
      mgnt.phoneNumber||'',mgnt.contactEmail||'',mgnt.age||'',mgnt.gender||'',mgnt.occupation||'',
      mgnt.reportRecipientName||'',mgnt.reportRecipientEmail||'',mgnt.mailingAddress||'',
      mgnt.aplSource||'',mgnt.aplRank||'C',mgnt.reportSts||'00',now,mgnt.id);
    saveMasterList(mgnt.id, dto.aplInquiryMasterList);
    saveProgressHistory(mgnt.id, dto.bizProgressHistoryList);
    saveReportSend(mgnt.id, dto.aplReportSendList);
    console.log(`[MGNT] 更新: ${mgnt.id}`);
  }
  ok(res,null);
});

// 削除
r.delete('/apl/inquiry_mgnt', auth, (req,res) => {
  const {id} = req.query;
  if (!id) return fail(res,'IDが必要です');
  db.prepare('DELETE FROM apl_inquiry_master WHERE inquiry_id=?').run(id);
  db.prepare('DELETE FROM biz_progress_history WHERE inquiry_id=?').run(id);
  db.prepare('DELETE FROM apl_report_send WHERE inquiry_id=?').run(id);
  db.prepare('DELETE FROM apl_inquiry_management WHERE id=?').run(id);
  console.log(`[MGNT] 削除: ${id}`);
  ok(res,null);
});

// 帳票送付リスト
r.get('/apl/report/send/list', auth, (req,res) => {
  const {bizDataNo} = req.query;
  const rows = bizDataNo
    ? db.prepare('SELECT * FROM apl_report_send WHERE inquiry_id=? ORDER BY create_at DESC').all(bizDataNo)
    : [];
  ok(res, rows.map(toReportDto));
});

// 対応履歴リスト（otoiawase）
r.get('/apl/inquiry/lisOtoiawase', auth, (req,res) => {
  const {bizDataNo} = req.query;
  const rows = bizDataNo
    ? db.prepare('SELECT * FROM biz_progress_history WHERE inquiry_id=? ORDER BY action_date DESC').all(bizDataNo)
    : [];
  ok(res, rows.map(toHistoryDto));
});

// ================================================================
// 協力業者
// ================================================================
r.post('/biz/partner/info/page', auth, (req,res) => {
  const {current=1, size=10, data:cond={}} = req.body;
  const offset = (current-1)*size;
  const where = ['1=1']; const params = [];
  if (cond.recordNo)     { where.push('record_no LIKE ?');    params.push(`%${cond.recordNo}%`); }
  if (cond.partnerRank)  { where.push('partner_rank = ?');    params.push(cond.partnerRank); }
  if (cond.industry)     { where.push('industry = ?');        params.push(cond.industry); }
  const w = where.join(' AND ');
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM biz_partner_info WHERE ${w}`).get(...params).cnt;
  const rows  = db.prepare(`SELECT * FROM biz_partner_info WHERE ${w} ORDER BY create_at DESC LIMIT ? OFFSET ?`).all(...params, size, offset);
  okPage(res, rows.map(toBizDto), total, current, size);
});

r.get('/biz/partner/info', auth, (req,res) => {
  const {id} = req.query;
  if (!id) { ok(res, db.prepare('SELECT * FROM biz_partner_info ORDER BY create_at DESC').all().map(toBizDto)); return; }
  const row = db.prepare('SELECT * FROM biz_partner_info WHERE id=?').get(id);
  if (!row) return fail(res,'対象データが見つかりません',404);
  ok(res, toBizDto(row));
});

r.post('/biz/partner/info', auth, (req,res) => {
  const d = req.body; const now = nowStr();
  const id = d.id || genId('BIZ');
  db.prepare(`INSERT OR REPLACE INTO biz_partner_info
    (id,record_no,record_type,partner_rank,industry,other,registration_date,
     company_name,department_name,representative_name,position,postal_code,
     prefecture,address,tel,fax,mobile,email,homepage,service_area,
     service_area_detail,provided_service,memo,attach_overview,attach_detail,
     customer_case_link,create_at,update_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,
    COALESCE((SELECT create_at FROM biz_partner_info WHERE id=?),?),?)`
  ).run(id,d.recordNo||'',d.recordType||'',d.partnerRank||'',d.industry||'',
    d.other||'',d.registrationDate||now,d.companyName||'',d.departmentName||'',
    d.representativeName||'',d.position||'',d.postalCode||'',d.prefecture||'',
    d.address||'',d.tel||'',d.fax||'',d.mobile||'',d.email||'',d.homepage||'',
    Array.isArray(d.serviceArea)?d.serviceArea.join(','):d.serviceArea||'',
    d.serviceAreaDetail||'',d.providedService||'',d.memo||'',
    d.attachOverview||'',d.attachDetail||'',d.customerCaseLink||'',
    id,now,now);
  console.log(`[BIZ] 保存: ${id}`);
  ok(res,null);
});

r.put('/biz/partner/info', auth, (req,res) => {
  const d = req.body; const now = nowStr();
  if (!d.id) return fail(res,'IDが必要です');
  db.prepare(`UPDATE biz_partner_info SET
    record_no=?,record_type=?,partner_rank=?,industry=?,other=?,registration_date=?,
    company_name=?,department_name=?,representative_name=?,position=?,postal_code=?,
    prefecture=?,address=?,tel=?,fax=?,mobile=?,email=?,homepage=?,service_area=?,
    service_area_detail=?,provided_service=?,memo=?,attach_overview=?,attach_detail=?,
    customer_case_link=?,update_at=? WHERE id=?`
  ).run(d.recordNo||'',d.recordType||'',d.partnerRank||'',d.industry||'',
    d.other||'',d.registrationDate||now,d.companyName||'',d.departmentName||'',
    d.representativeName||'',d.position||'',d.postalCode||'',d.prefecture||'',
    d.address||'',d.tel||'',d.fax||'',d.mobile||'',d.email||'',d.homepage||'',
    Array.isArray(d.serviceArea)?d.serviceArea.join(','):d.serviceArea||'',
    d.serviceAreaDetail||'',d.providedService||'',d.memo||'',
    d.attachOverview||'',d.attachDetail||'',d.customerCaseLink||'',now,d.id);
  ok(res,null);
});

r.delete('/biz/partner/info', auth, (req,res) => {
  const {id} = req.query;
  db.prepare('DELETE FROM biz_partner_info WHERE id=?').run(id);
  ok(res,null);
});

// ================================================================
// 見込み顧客
// ================================================================
r.post('/pot/potential/master/page', auth, (req,res) => {
  const {current=1, size=10, data:cond={}} = req.body;
  const offset = (current-1)*size;
  const where = ['1=1']; const params = [];
  if (cond.id)              { where.push('p.id LIKE ?');                      params.push(`%${cond.id}%`); }
  if (cond.consultantName)  { where.push('c.consultant_name LIKE ?');         params.push(`%${cond.consultantName}%`); }
  if (cond.dateFrom)        { where.push('p.reception_date >= ?');            params.push(cond.dateFrom); }
  if (cond.dateTo)          { where.push('p.reception_date <= ?');            params.push(cond.dateTo); }
  const w = where.join(' AND ');
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM pot_potential_master p LEFT JOIN pot_customer_info c ON c.pot_id=p.id WHERE ${w}`).get(...params).cnt;
  const rows  = db.prepare(`SELECT p.*,c.consultant_name,c.furigana,c.phone_number,c.email_address,c.current_residence,s.source as source_name FROM pot_potential_master p LEFT JOIN pot_customer_info c ON c.pot_id=p.id LEFT JOIN apl_inquiry_source s ON s.code=p.pot_source WHERE ${w} ORDER BY p.reception_date DESC LIMIT ? OFFSET ?`).all(...params, size, offset);
  const records = rows.map(r => ({
    potPotentialMaster: toPotDto(r),
    potCustomerInfo:    {consultantName:r.consultant_name||'', furigana:r.furigana||'', phoneNumber:r.phone_number||'', emailAddress:r.email_address||'', currentResidence:r.current_residence||''},
    aplInquirySource:   {source: r.source_name||''},
  }));
  okPage(res, records, total, current, size);
});

r.get('/pot/potential/master', auth, (req,res) => {
  const {id} = req.query;
  const row = id ? db.prepare('SELECT * FROM pot_potential_master WHERE id=?').get(id) : null;
  if (!row) return fail(res,'対象データが見つかりません',404);
  const cust  = db.prepare('SELECT * FROM pot_customer_info WHERE pot_id=?').get(id)||{};
  const estate= db.prepare('SELECT * FROM pot_real_estate_summary WHERE pot_id=?').get(id)||{};
  ok(res, {
    potPotentialMaster:   toPotDto(row),
    potCustomerInfo:      {consultantName:cust.consultant_name||'',furigana:cust.furigana||'',phoneNumber:cust.phone_number||'',mobileNumber:cust.mobile_number||'',emailAddress:cust.email_address||'',reportSendingEmail:cust.report_sending_email||'',currentResidence:cust.current_residence||'',residence:cust.residence||'',residencePostalCode:cust.residence_postal_code||'',residenceAddress:cust.residence_address||'',postalAddress:cust.postal_address||''},
    potRealEstateSummary: {q11:estate.q11||'',q12:estate.q12||'',vacantYears:estate.vacant_years||'',location:estate.location||'',landArea:estate.land_area||'',buildingArea:estate.building_area||'',buildingYear:estate.building_year||'',memo:estate.memo||''},
  });
});

r.post('/pot/potential/master', auth, (req,res) => {
  const dto = req.body; const now = nowStr();
  const master = dto.potPotentialMaster || dto;
  const cust   = dto.potCustomerInfo || {};
  const estate = dto.potRealEstateSummary || {};
  const id = master.id || genId('POT');
  const isNew = !master.id || !db.prepare('SELECT 1 FROM pot_potential_master WHERE id=?').get(master.id);
  if (isNew) {
    db.prepare('INSERT INTO pot_potential_master (id,temp_id,handling_status,reception_date,pot_source,pot_details,pot_manager_worker,pot_manager_ct,inquiry_id,pot_rank,certainty,create_at,update_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
      id,master.tempId||id,master.handlingStatus||'01',master.receptionDate||now,
      master.potSource||'',master.potDetails||'',master.potManagerWorker||'',
      master.potManagerCt||'',master.inquiryId||'',master.potRank||'C',
      master.certainty||'',now,now);
    db.prepare('INSERT INTO pot_customer_info (id,pot_id,consultant_name,furigana,phone_number,mobile_number,email_address,report_sending_email,current_residence,residence,residence_postal_code,residence_address,postal_address,create_at,update_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').run(
      genId('POTC'),id,cust.consultantName||'',cust.furigana||'',cust.phoneNumber||'',
      cust.mobileNumber||'',cust.emailAddress||'',cust.reportSendingEmail||'',
      cust.currentResidence||'',cust.residence||'',cust.residencePostalCode||'',
      cust.residenceAddress||'',cust.postalAddress||'',now,now);
    db.prepare('INSERT INTO pot_real_estate_summary (id,pot_id,q11,q12,vacant_years,location,land_area,building_area,building_year,memo,create_at,update_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)').run(
      genId('POTR'),id,estate.q11||'',estate.q12||'',estate.vacantYears||'',
      estate.location||'',estate.landArea||'',estate.buildingArea||'',
      estate.buildingYear||'',estate.memo||'',now,now);
  } else {
    db.prepare('UPDATE pot_potential_master SET temp_id=?,handling_status=?,reception_date=?,pot_source=?,pot_details=?,pot_manager_worker=?,pot_manager_ct=?,inquiry_id=?,pot_rank=?,certainty=?,update_at=? WHERE id=?').run(
      master.tempId||id,master.handlingStatus||'01',master.receptionDate||now,
      master.potSource||'',master.potDetails||'',master.potManagerWorker||'',
      master.potManagerCt||'',master.inquiryId||'',master.potRank||'C',
      master.certainty||'',now,id);
    const existCust = db.prepare('SELECT id FROM pot_customer_info WHERE pot_id=?').get(id);
    if (existCust) {
      db.prepare('UPDATE pot_customer_info SET consultant_name=?,furigana=?,phone_number=?,mobile_number=?,email_address=?,report_sending_email=?,current_residence=?,residence=?,residence_postal_code=?,residence_address=?,postal_address=?,update_at=? WHERE pot_id=?').run(
        cust.consultantName||'',cust.furigana||'',cust.phoneNumber||'',cust.mobileNumber||'',
        cust.emailAddress||'',cust.reportSendingEmail||'',cust.currentResidence||'',
        cust.residence||'',cust.residencePostalCode||'',cust.residenceAddress||'',
        cust.postalAddress||'',now,id);
    }
    const existEstate = db.prepare('SELECT id FROM pot_real_estate_summary WHERE pot_id=?').get(id);
    if (existEstate) {
      db.prepare('UPDATE pot_real_estate_summary SET q11=?,q12=?,vacant_years=?,location=?,land_area=?,building_area=?,building_year=?,memo=?,update_at=? WHERE pot_id=?').run(
        estate.q11||'',estate.q12||'',estate.vacantYears||'',estate.location||'',
        estate.landArea||'',estate.buildingArea||'',estate.buildingYear||'',estate.memo||'',now,id);
    }
  }
  ok(res,null);
});

r.delete('/pot/potential/master', auth, (req,res) => {
  const {id} = req.query;
  db.prepare('DELETE FROM pot_real_estate_summary WHERE pot_id=?').run(id);
  db.prepare('DELETE FROM pot_customer_info WHERE pot_id=?').run(id);
  db.prepare('DELETE FROM pot_potential_master WHERE id=?').run(id);
  ok(res,null);
});

// ================================================================
// 施工業者（顧客）
// ================================================================
r.post('/pro/contractor/info/page', auth, (req,res) => {
  const {current=1, size=10, data:cond={}} = req.body;
  const offset = (current-1)*size;
  const where = ['1=1']; const params = [];
  if (cond.consultantName) { where.push('consultant_name LIKE ?'); params.push(`%${cond.consultantName}%`); }
  if (cond.status)         { where.push('status = ?');             params.push(cond.status); }
  const w = where.join(' AND ');
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM pro_contractor_info WHERE ${w}`).get(...params).cnt;
  const rows  = db.prepare(`SELECT * FROM pro_contractor_info WHERE ${w} ORDER BY reception_date DESC LIMIT ? OFFSET ?`).all(...params, size, offset);
  okPage(res, rows.map(r => ({proContractorInfo: toProDto(r)})), total, current, size);
});

r.get('/pro/contractor/info', auth, (req,res) => {
  const {id} = req.query;
  const row = id ? db.prepare('SELECT * FROM pro_contractor_info WHERE id=?').get(id) : null;
  if (!row) return fail(res,'対象データが見つかりません',404);
  ok(res, {proContractorInfo: toProDto(row)});
});

r.post('/pro/contractor/info', auth, (req,res) => {
  const dto = req.body; const now = nowStr();
  const d = dto.proContractorInfo || dto;
  const id = d.id || genId('PRO');
  const isNew = !d.id || !db.prepare('SELECT 1 FROM pro_contractor_info WHERE id=?').get(d.id);
  const stmt = isNew
    ? db.prepare('INSERT INTO pro_contractor_info (id,status,reception_date,case_handler,pot_id,customer_id,consultant_name,furigana,case_source,case_details,tel,mobile_number,email_address,residence_postal_code,residence_area,residence_address,postal_address,preferred_contact_method,available_days,other_conditions,available_time,memo,create_at,update_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    : db.prepare('UPDATE pro_contractor_info SET status=?,reception_date=?,case_handler=?,pot_id=?,customer_id=?,consultant_name=?,furigana=?,case_source=?,case_details=?,tel=?,mobile_number=?,email_address=?,residence_postal_code=?,residence_area=?,residence_address=?,postal_address=?,preferred_contact_method=?,available_days=?,other_conditions=?,available_time=?,memo=?,update_at=? WHERE id=?');
  const args = [d.status||'01',d.receptionDate||now,d.caseHandler||'',d.potId||'',d.customerId||'',
    d.consultantName||'',d.furigana||'',d.caseSource||'',d.caseDetails||'',
    d.tel||'',d.mobileNumber||'',d.emailAddress||'',d.residencePostalCode||'',
    d.residenceArea||'',d.residenceAddress||'',d.postalAddress||'',
    d.preferredContactMethod||'',d.availableDays||'',d.otherConditions||'',
    d.availableTime||'',d.memo||'',now];
  if (isNew) stmt.run(id,...args);
  else stmt.run(...args, d.id);
  ok(res,null);
});

r.delete('/pro/contractor/info', auth, (req,res) => {
  const {id} = req.query;
  db.prepare('DELETE FROM pro_contractor_info WHERE id=?').run(id);
  ok(res,null);
});

// ================================================================
// システム管理 - ユーザー
// ================================================================
r.post('/sys/user/page', auth, (req,res) => {
  const {current=1, size=10, data:cond={}} = req.body;
  const offset = (current-1)*size;
  const where = ['1=1']; const params = [];
  if (cond.fullName) { where.push('full_name LIKE ?'); params.push(`%${cond.fullName}%`); }
  if (cond.email)    { where.push('email LIKE ?');     params.push(`%${cond.email}%`); }
  const w = where.join(' AND ');
  const total = db.prepare(`SELECT COUNT(*) as cnt FROM users WHERE ${w}`).get(...params).cnt;
  const rows  = db.prepare(`SELECT id,full_name,email,role,user_type,created_at,updated_at FROM users WHERE ${w} ORDER BY id LIMIT ? OFFSET ?`).all(...params, size, offset);
  const records = rows.map(r => ({sysUser:{id:r.id,fullName:r.full_name,email:r.email,role:r.role,userType:r.user_type,createAt:r.created_at,updateAt:r.updated_at}}));
  okPage(res, records, total, current, size);
});

r.get('/sys/user/list', auth, (req,res) => {
  ok(res, db.prepare('SELECT id,full_name,email,role,user_type FROM users ORDER BY id').all()
    .map(r => ({id:r.id,fullName:r.full_name,email:r.email,role:r.role,userType:r.user_type})));
});

r.get('/sys/user/qryByUserType/:userType', auth, (req,res) => {
  const types = req.params.userType.split(',');
  const placeholders = types.map(()=>'?').join(',');
  const rows = db.prepare(`SELECT id,full_name,email,user_type FROM users WHERE user_type IN (${placeholders})`).all(...types);
  ok(res, rows.map(r => ({id:r.id,fullName:r.full_name,email:r.email})));
});

r.get('/sys/user/:id', auth, (req,res) => {
  const row = db.prepare('SELECT id,full_name,email,role,user_type,created_at,updated_at FROM users WHERE id=?').get(req.params.id);
  if (!row) return fail(res,'ユーザーが見つかりません',404);
  ok(res, {sysUser:{id:row.id,fullName:row.full_name,email:row.email,role:row.role,userType:row.user_type,userPasswd:'',createAt:row.created_at,updateAt:row.updated_at}});
});

r.post('/sys/user', auth, (req,res) => {
  const u = req.body?.sysUser || req.body;
  if (!u.email || !u.fullName) return fail(res,'氏名とメールアドレスは必須です');
  try {
    db.prepare('INSERT INTO users (full_name,email,password,role,user_type) VALUES (?,?,?,?,?)').run(
      u.fullName, u.email, u.userPasswd||'password123', u.role||'USER', u.userType||'3');
    ok(res,null);
  } catch(e) { fail(res,'メールアドレスが既に使用されています'); }
});

r.put('/sys/user', auth, (req,res) => {
  const u = req.body?.sysUser || req.body;
  db.prepare('UPDATE users SET full_name=?,email=?,role=?,user_type=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(
    u.fullName, u.email, u.role, u.userType||'3', u.id);
  if (u.userPasswd) db.prepare('UPDATE users SET password=? WHERE id=?').run(u.userPasswd, u.id);
  ok(res,null);
});

r.delete('/sys/user', auth, (req,res) => {
  db.prepare('DELETE FROM users WHERE id=?').run(req.query.id);
  ok(res,null);
});

// ================================================================
// システム管理 - ロール
// ================================================================
r.post('/sys/role/page', auth, (req,res) => {
  const {current=1, size=10} = req.body;
  const offset = (current-1)*size;
  const total  = db.prepare('SELECT COUNT(*) as cnt FROM sys_roles').get().cnt;
  const rows   = db.prepare('SELECT * FROM sys_roles ORDER BY id LIMIT ? OFFSET ?').all(size, offset);
  okPage(res, rows.map(r => ({sysRole:toRoleDto(r)})), total, current, size);
});

r.get('/sys/role/list', auth, (req,res) => {
  ok(res, db.prepare('SELECT * FROM sys_roles ORDER BY id').all().map(toRoleDto));
});

r.get('/sys/role/:id', auth, (req,res) => {
  const row = db.prepare('SELECT * FROM sys_roles WHERE id=?').get(req.params.id);
  if (!row) return fail(res,'ロールが見つかりません',404);
  ok(res, {sysRole: toRoleDto(row)});
});

r.post('/sys/role', auth, (req,res) => {
  const role = req.body?.sysRole || req.body;
  try {
    db.prepare('INSERT INTO sys_roles (role_name,role_code,role_type,description) VALUES (?,?,?,?)').run(
      role.roleName||'', role.roleCode||'', role.roleType||'', role.description||'');
    ok(res,null);
  } catch(e) { fail(res,'ロールコードが既に使用されています'); }
});

r.put('/sys/role', auth, (req,res) => {
  const role = req.body?.sysRole || req.body;
  db.prepare('UPDATE sys_roles SET role_name=?,role_code=?,role_type=?,description=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(
    role.roleName||'', role.roleCode||'', role.roleType||'', role.description||'', role.id);
  ok(res,null);
});

r.delete('/sys/role', auth, (req,res) => {
  db.prepare('DELETE FROM sys_roles WHERE id=?').run(req.query.id);
  ok(res,null);
});

// ================================================================
// ファイル管理（POC軽量版）
// ================================================================
r.post('/sys/file/mgnt/upload', auth, upload.single('file'), (req,res) => {
  if (!req.file) return fail(res,'ファイルが見つかりません');
  const fileId = genId('FL');
  console.log(`[FILE] アップロード: ${req.file.originalname}`);
  ok(res, {id:fileId, fileId, fileName:req.file.originalname, size:req.file.size});
});

r.get('/sys/file/mgnt/download/:fileId', auth, (req,res) => {
  res.json({message:'POCモード: ダウンロードスキップ'});
});

r.get('/sys/file/mgnt', auth, (req,res) => {
  ok(res, []);
});

// ================================================================
// ユーティリティ
// ================================================================
r.get('/util/kanji', (req,res) => ok(res, {kana:''}));
r.get('/util/getkana', (req,res) => ok(res, {kana:''}));

// /jikajimai プレフィックス
app.use('/jikajimai', r);

// ================================================================
// ヘルパー関数
// ================================================================
function getMasterMap(inquiryId) {
  const rows = db.prepare('SELECT question_key,answer_val FROM apl_inquiry_master WHERE inquiry_id=?').all(inquiryId);
  const map = {};
  rows.forEach(r => { map[r.question_key] = r.answer_val; });
  return map;
}
function getMasterList(inquiryId) {
  return db.prepare('SELECT * FROM apl_inquiry_master WHERE inquiry_id=?').all(inquiryId);
}
function saveMasterList(inquiryId, list) {
  if (!list || !Array.isArray(list)) return;
  db.prepare('DELETE FROM apl_inquiry_master WHERE inquiry_id=?').run(inquiryId);
  const ins = db.prepare('INSERT INTO apl_inquiry_master (id,inquiry_id,question_key,answer_val) VALUES (?,?,?,?)');
  list.forEach((m,i) => ins.run(m.id||`${inquiryId}-M${i}`,inquiryId,m.questionKey||m.question_key||'',m.answerVal||m.answer_val||''));
}
function saveProgressHistory(inquiryId, list) {
  if (!list || !Array.isArray(list)) return;
  db.prepare('DELETE FROM biz_progress_history WHERE inquiry_id=?').run(inquiryId);
  const ins = db.prepare('INSERT INTO biz_progress_history (id,inquiry_id,action_date,action_content) VALUES (?,?,?,?)');
  list.forEach((h,i) => ins.run(h.id||genId('HST'),inquiryId,h.actionDate||nowStr(),h.actionContent||''));
}
function saveReportSend(inquiryId, list) {
  if (!list || !Array.isArray(list)) return;
  const ins = db.prepare('INSERT OR REPLACE INTO apl_report_send (id,inquiry_id,delivery_mod,send_sts,sent_date,worker,file_id,file_name,remark,create_at,update_at) VALUES (?,?,?,?,?,?,?,?,?,COALESCE((SELECT create_at FROM apl_report_send WHERE id=?),?),?)');
  const now = nowStr();
  list.forEach(s => ins.run(s.id||genId('RPT'),inquiryId,s.deliveryMod||'1',s.sendSts||'00',s.sentDate||'',s.worker||'',s.fileId||'',s.fileName||'',s.remark||'',s.id,now,now));
}

function toMgntDto(r) {
  return {
    id:r.id, handlingDate:r.handling_date, handlingStatus:r.handling_status,
    loginEmail:r.login_email||'', customerName:r.customer_name, nameFurigana:r.name_furigana||'',
    currentRegion:r.current_region||'', phoneNumber:r.phone_number||'', contactEmail:r.contact_email||'',
    age:r.age||'', gender:r.gender||'', occupation:r.occupation||'',
    reportRecipientName:r.report_recipient_name||'', reportRecipientEmail:r.report_recipient_email||'',
    mailingAddress:r.mailing_address||'', aplSource:r.apl_source||'', aplRank:r.apl_rank||'C',
    reportSts:r.report_sts||'00', createAt:r.create_at, updateAt:r.update_at,
  };
}
function toReportDto(r) {
  return {id:r.id,inquiryId:r.inquiry_id,deliveryMod:r.delivery_mod||'',sendSts:r.send_sts||'00',sentDate:r.sent_date||'',worker:r.worker||'',fileId:r.file_id||'',fileName:r.file_name||'',remark:r.remark||'',createAt:r.create_at,updateAt:r.update_at};
}
function toHistoryDto(r) {
  return {id:r.id,inquiryId:r.inquiry_id,actionDate:r.action_date||'',actionContent:r.action_content||'',createdBy:r.created_by||'',createAt:r.create_at};
}
function toBizDto(r) {
  return {
    id:r.id,recordNo:r.record_no||'',recordType:r.record_type||'',partnerRank:r.partner_rank||'',
    industry:r.industry||'',other:r.other||'',registrationDate:r.registration_date||'',
    companyName:r.company_name||'',departmentName:r.department_name||'',
    representativeName:r.representative_name||'',position:r.position||'',
    postalCode:r.postal_code||'',prefecture:r.prefecture||'',address:r.address||'',
    tel:r.tel||'',fax:r.fax||'',mobile:r.mobile||'',email:r.email||'',homepage:r.homepage||'',
    serviceArea:r.service_area?r.service_area.split(',').filter(Boolean):[],
    serviceAreaDetail:r.service_area_detail||'',providedService:r.provided_service||'',
    memo:r.memo||'',attachOverview:r.attach_overview||'',attachDetail:r.attach_detail||'',
    customerCaseLink:r.customer_case_link||'',createAt:r.create_at,updateAt:r.update_at,
  };
}
function toPotDto(r) {
  return {
    id:r.id,tempId:r.temp_id||r.id,handlingStatus:r.handling_status||'01',
    receptionDate:r.reception_date||'',potSource:r.pot_source||'',potDetails:r.pot_details||'',
    potManagerWorker:r.pot_manager_worker||'',potManagerCt:r.pot_manager_ct||'',
    inquiryId:r.inquiry_id||'',potRank:r.pot_rank||'C',certainty:r.certainty||'',
    createAt:r.create_at,updateAt:r.update_at,
  };
}
function toProDto(r) {
  return {
    id:r.id,status:r.status||'01',receptionDate:r.reception_date||'',
    caseHandler:r.case_handler||'',potId:r.pot_id||'',customerId:r.customer_id||'',
    consultantName:r.consultant_name||'',furigana:r.furigana||'',
    caseSource:r.case_source||'',caseDetails:r.case_details||'',
    tel:r.tel||'',mobileNumber:r.mobile_number||'',emailAddress:r.email_address||'',
    residencePostalCode:r.residence_postal_code||'',residenceArea:r.residence_area||'',
    residenceAddress:r.residence_address||'',postalAddress:r.postal_address||'',
    preferredContactMethod:r.preferred_contact_method||'',availableDays:r.available_days||'',
    otherConditions:r.other_conditions||'',availableTime:r.available_time||'',
    memo:r.memo||'',createAt:r.create_at,updateAt:r.update_at,
  };
}
function toRoleDto(r) {
  return {id:r.id,roleName:r.role_name||'',roleCode:r.role_code||'',roleType:r.role_type||'',description:r.description||'',createAt:r.created_at,updateAt:r.updated_at};
}

// ================================================================
// ヘルスチェック
// ================================================================
app.get('/health', (req,res) => res.json({status:'ok',mode:'POC-Mock',db:'SQLite'}));
app.get('/', (req,res) => res.json({message:'RICS Mock API Server',version:'2.0.0-POC'}));

app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   RICS Mock API Server v2 (POC)          ║');
  console.log(`║   http://localhost:${PORT}/jikajimai        ║`);
  console.log('║   メール送信: 無効（軽量モード）           ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('  admin@rics.co.jp / password123');
  console.log('');
});
