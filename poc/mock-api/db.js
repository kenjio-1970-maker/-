/**
 * db.js — SQLite DB初期化 + サンプルデータ投入
 * ソース(rics-back)のエンティティに完全対応
 */
const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'poc_data.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ==================== テーブル作成 ====================
db.exec(`
  -- ユーザー
  CREATE TABLE IF NOT EXISTS users (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    password    TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'USER',
    user_type   TEXT DEFAULT '3',
    created_at  TEXT DEFAULT (datetime('now','localtime')),
    updated_at  TEXT DEFAULT (datetime('now','localtime'))
  );

  -- ロール
  CREATE TABLE IF NOT EXISTS sys_roles (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name   TEXT NOT NULL,
    role_code   TEXT NOT NULL UNIQUE,
    role_type   TEXT,
    description TEXT,
    create_user TEXT,
    update_user TEXT,
    created_at  TEXT DEFAULT (datetime('now','localtime')),
    updated_at  TEXT DEFAULT (datetime('now','localtime'))
  );

  -- コードマスタ
  CREATE TABLE IF NOT EXISTS sys_code_mapping (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    code_key    TEXT NOT NULL,
    code_value  TEXT NOT NULL,
    label       TEXT NOT NULL,
    sort_order  INTEGER DEFAULT 0
  );

  -- 問い合わせ管理
  CREATE TABLE IF NOT EXISTS apl_inquiry_management (
    id                      TEXT PRIMARY KEY,
    handling_date           TEXT,
    handling_status         TEXT DEFAULT '01',
    login_email             TEXT,
    customer_name           TEXT NOT NULL,
    name_furigana           TEXT,
    current_region          TEXT,
    phone_number            TEXT,
    contact_email           TEXT,
    age                     TEXT,
    gender                  TEXT,
    occupation              TEXT,
    report_recipient_name   TEXT,
    report_recipient_email  TEXT,
    mailing_address         TEXT,
    apl_source              TEXT,
    apl_rank                TEXT DEFAULT 'C',
    report_sts              TEXT DEFAULT '00',
    create_at               TEXT DEFAULT (datetime('now','localtime')),
    update_at               TEXT DEFAULT (datetime('now','localtime'))
  );

  -- アンケート回答
  CREATE TABLE IF NOT EXISTS apl_inquiry_master (
    id           TEXT PRIMARY KEY,
    inquiry_id   TEXT NOT NULL REFERENCES apl_inquiry_management(id) ON DELETE CASCADE,
    question_key TEXT NOT NULL,
    answer_val   TEXT,
    create_at    TEXT DEFAULT (datetime('now','localtime'))
  );

  -- 流入経路マスタ
  CREATE TABLE IF NOT EXISTS apl_inquiry_source (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    code   TEXT NOT NULL UNIQUE,
    source TEXT NOT NULL
  );

  -- 帳票送付
  CREATE TABLE IF NOT EXISTS apl_report_send (
    id           TEXT PRIMARY KEY,
    inquiry_id   TEXT NOT NULL REFERENCES apl_inquiry_management(id) ON DELETE CASCADE,
    delivery_mod TEXT,
    send_sts     TEXT DEFAULT '00',
    sent_date    TEXT,
    worker       TEXT,
    file_id      TEXT,
    file_name    TEXT,
    remark       TEXT,
    create_at    TEXT DEFAULT (datetime('now','localtime')),
    update_at    TEXT DEFAULT (datetime('now','localtime'))
  );

  -- 進捗履歴（対応履歴）
  CREATE TABLE IF NOT EXISTS biz_progress_history (
    id           TEXT PRIMARY KEY,
    inquiry_id   TEXT NOT NULL REFERENCES apl_inquiry_management(id) ON DELETE CASCADE,
    action_date  TEXT,
    action_content TEXT,
    action       TEXT,
    memo         TEXT,
    created_by   TEXT,
    create_at    TEXT DEFAULT (datetime('now','localtime'))
  );

  -- 協力業者
  CREATE TABLE IF NOT EXISTS biz_partner_info (
    id                   TEXT PRIMARY KEY,
    record_no            TEXT,
    record_type          TEXT,
    partner_rank         TEXT,
    industry             TEXT,
    other                TEXT,
    registration_date    TEXT,
    company_name         TEXT,
    department_name      TEXT,
    representative_name  TEXT,
    position             TEXT,
    postal_code          TEXT,
    prefecture           TEXT,
    address              TEXT,
    tel                  TEXT,
    fax                  TEXT,
    mobile               TEXT,
    email                TEXT,
    homepage             TEXT,
    service_area         TEXT,
    service_area_detail  TEXT,
    provided_service     TEXT,
    memo                 TEXT,
    attach_overview      TEXT,
    attach_detail        TEXT,
    customer_case_link   TEXT,
    create_at            TEXT DEFAULT (datetime('now','localtime')),
    update_at            TEXT DEFAULT (datetime('now','localtime'))
  );

  -- 見込み顧客マスタ
  CREATE TABLE IF NOT EXISTS pot_potential_master (
    id                   TEXT PRIMARY KEY,
    temp_id              TEXT,
    handling_status      TEXT DEFAULT '01',
    reception_date       TEXT,
    pot_source           TEXT,
    pot_details          TEXT,
    pot_manager_worker   TEXT,
    pot_manager_ct       TEXT,
    inquiry_id           TEXT,
    pot_rank             TEXT,
    certainty            TEXT,
    create_at            TEXT DEFAULT (datetime('now','localtime')),
    update_at            TEXT DEFAULT (datetime('now','localtime'))
  );

  -- 見込み顧客情報（相談者）
  CREATE TABLE IF NOT EXISTS pot_customer_info (
    id                   TEXT PRIMARY KEY,
    pot_id               TEXT NOT NULL REFERENCES pot_potential_master(id) ON DELETE CASCADE,
    consultant_name      TEXT,
    furigana             TEXT,
    phone_number         TEXT,
    mobile_number        TEXT,
    email_address        TEXT,
    report_sending_email TEXT,
    current_residence    TEXT,
    residence            TEXT,
    residence_postal_code TEXT,
    residence_address    TEXT,
    postal_address       TEXT,
    create_at            TEXT DEFAULT (datetime('now','localtime')),
    update_at            TEXT DEFAULT (datetime('now','localtime'))
  );

  -- 不動産情報（pot）
  CREATE TABLE IF NOT EXISTS pot_real_estate_summary (
    id                TEXT PRIMARY KEY,
    pot_id            TEXT NOT NULL REFERENCES pot_potential_master(id) ON DELETE CASCADE,
    q11               TEXT,
    q12               TEXT,
    vacant_years      TEXT,
    location          TEXT,
    land_area         TEXT,
    building_area     TEXT,
    building_year     TEXT,
    memo              TEXT,
    create_at         TEXT DEFAULT (datetime('now','localtime')),
    update_at         TEXT DEFAULT (datetime('now','localtime'))
  );

  -- 施工業者（顧客）
  CREATE TABLE IF NOT EXISTS pro_contractor_info (
    id                       TEXT PRIMARY KEY,
    status                   TEXT DEFAULT '01',
    reception_date           TEXT,
    case_handler             TEXT,
    pot_id                   TEXT,
    customer_id              TEXT,
    consultant_name          TEXT,
    furigana                 TEXT,
    case_source              TEXT,
    case_details             TEXT,
    tel                      TEXT,
    mobile_number            TEXT,
    email_address            TEXT,
    residence_postal_code    TEXT,
    residence_area           TEXT,
    residence_address        TEXT,
    postal_address           TEXT,
    preferred_contact_method TEXT,
    available_days           TEXT,
    other_conditions         TEXT,
    available_time           TEXT,
    memo                     TEXT,
    create_at                TEXT DEFAULT (datetime('now','localtime')),
    update_at                TEXT DEFAULT (datetime('now','localtime'))
  );
`);

// ==================== サンプルデータ ====================
const seedData = db.transaction(() => {

  // ユーザー
  [
    ['RICS管理者', 'admin@rics.co.jp', 'password123', 'ADMIN', '4'],
    ['担当者A（ワーカー）', 'user_a@rics.co.jp', 'password123', 'USER', '3'],
    ['担当者B（CT）', 'user_b@rics.co.jp', 'password123', 'USER', '1'],
  ].forEach(([n,e,p,r,t]) =>
    db.prepare('INSERT OR IGNORE INTO users (full_name,email,password,role,user_type) VALUES (?,?,?,?,?)').run(n,e,p,r,t)
  );

  // ロール
  [
    ['管理者','ADMIN','1','システム管理者'],
    ['担当者','USER','3','一般担当者'],
    ['閲覧者','VIEWER','5','閲覧のみ'],
    ['CTマスタ','CT','1','コンサルタント'],
    ['ワーカー','WORKER','3','現地対応スタッフ'],
  ].forEach(([n,c,t,d]) =>
    db.prepare('INSERT OR IGNORE INTO sys_roles (role_name,role_code,role_type,description) VALUES (?,?,?,?)').run(n,c,t,d)
  );

  // コードマスタ
  const codes = [
    // 対応状況（問い合わせ）
    ['SCM_INQUIRY_RESP_STATUS','01','未対応',1],
    ['SCM_INQUIRY_RESP_STATUS','02','対応中',2],
    ['SCM_INQUIRY_RESP_STATUS','03','対応済み',3],
    ['SCM_INQUIRY_RESP_STATUS','04','保留',4],
    // 送付結果
    ['STSTE_SEND_REPORT','00','未送付',1],
    ['STSTE_SEND_REPORT','01','送付済み',2],
    ['STSTE_SEND_REPORT','02','送付失敗',3],
    // 送付手段
    ['FORM_REPORT_SHIPPING_METHOD','1','メール送付',1],
    ['FORM_REPORT_SHIPPING_METHOD','2','郵送',2],
    // レポート送付方法
    ['REPORT_SEND_MOD','1','メール',1],
    ['REPORT_SEND_MOD','2','郵送',2],
    // ランク（問い合わせ）
    ['SCM_APL_RANK','S','Sランク',1],
    ['SCM_APL_RANK','A','Aランク',2],
    ['SCM_APL_RANK','B','Bランク',3],
    ['SCM_APL_RANK','C','Cランク',4],
    // 見込み顧客対応状況
    ['SCM_POTENTIAL_RESP_STATUS','01','未対応',1],
    ['SCM_POTENTIAL_RESP_STATUS','02','対応中',2],
    ['SCM_POTENTIAL_RESP_STATUS','03','対応済み',3],
    ['SCM_POTENTIAL_RESP_STATUS','04','保留',4],
    // 見込み顧客ランク
    ['SCM_INTERVIEW_RANK','S','Sランク',1],
    ['SCM_INTERVIEW_RANK','A','Aランク',2],
    ['SCM_INTERVIEW_RANK','B','Bランク',3],
    ['SCM_INTERVIEW_RANK','C','Cランク',4],
    // 施工業者対応状況
    ['SCM_CUS_RESP_STATUS','01','未対応',1],
    ['SCM_CUS_RESP_STATUS','02','対応中',2],
    ['SCM_CUS_RESP_STATUS','03','対応済み',3],
    ['SCM_CUS_RESP_STATUS','04','保留',4],
    // 業種
    ['BIZ_INDUSTRY','01','解体',1],
    ['BIZ_INDUSTRY','02','清掃',2],
    ['BIZ_INDUSTRY','03','不動産',3],
    ['BIZ_INDUSTRY','04','建設',4],
    ['BIZ_INDUSTRY','05','その他',5],
    // 協力業者ランク
    ['BIZ_PARTNER_RANK','A','Aランク',1],
    ['BIZ_PARTNER_RANK','B','Bランク',2],
    ['BIZ_PARTNER_RANK','C','Cランク',3],
    // レコードタイプ
    ['BIZ_RECORD_TYPE','1','協力業者',1],
    ['BIZ_RECORD_TYPE','2','下請け',2],
    // 都道府県
    ['EQ_EMPTY_HOUSE_LOCATION','01','北海道',1],
    ['EQ_EMPTY_HOUSE_LOCATION','13','東京都',13],
    ['EQ_EMPTY_HOUSE_LOCATION','14','神奈川県',14],
    ['EQ_EMPTY_HOUSE_LOCATION','22','静岡県',22],
    ['EQ_EMPTY_HOUSE_LOCATION','23','愛知県',23],
    ['EQ_EMPTY_HOUSE_LOCATION','27','大阪府',27],
    ['EQ_EMPTY_HOUSE_LOCATION','34','広島県',34],
    ['EQ_EMPTY_HOUSE_LOCATION','40','福岡県',40],
    // 対応エリア
    ['BIZ_SERVICE_AREA','01','関東',1],
    ['BIZ_SERVICE_AREA','02','関西',2],
    ['BIZ_SERVICE_AREA','03','中部',3],
    ['BIZ_SERVICE_AREA','04','九州',4],
    ['BIZ_SERVICE_AREA','05','東北',5],
    ['BIZ_SERVICE_AREA','06','北海道',6],
    ['BIZ_SERVICE_AREA','07','中国',7],
    ['BIZ_SERVICE_AREA','08','四国',8],
    // ユーザー区分
    ['SYS_USER_TYPE','1','CTマスタ',1],
    ['SYS_USER_TYPE','2','スーパーCT',2],
    ['SYS_USER_TYPE','3','ワーカー',3],
    ['SYS_USER_TYPE','4','スーパーワーカー',4],
    ['SYS_USER_TYPE','5','顧客',5],
    // 年齢
    ['SCM_AGE','1','10代以下',1],
    ['SCM_AGE','2','20代',2],
    ['SCM_AGE','3','30代',3],
    ['SCM_AGE','4','40代',4],
    ['SCM_AGE','5','50代',5],
    ['SCM_AGE','6','60代',6],
    ['SCM_AGE','7','70代以上',7],
    // 性別
    ['SCM_GENDER','1','女性',1],
    ['SCM_GENDER','2','男性',2],
    ['SCM_GENDER','3','その他',3],
    ['SCM_GENDER','4','回答しない',4],
    // 職業
    ['SCM_JOB','1','会社員・役員',1],
    ['SCM_JOB','2','自営業',2],
    ['SCM_JOB','3','公務員',3],
    ['SCM_JOB','4','学生',4],
    ['SCM_JOB','5','専業主婦',5],
    ['SCM_JOB','6','パート・アルバイト',6],
    ['SCM_JOB','7','無職',7],
    ['SCM_JOB','8','その他',8],
    // 連絡方法
    ['PREFERRED_CONTACT','1','電話',1],
    ['PREFERRED_CONTACT','2','メール',2],
    ['PREFERRED_CONTACT','3','どちらでも',3],
  ];
  codes.forEach(([k,v,l,s]) => {
    if (!db.prepare('SELECT 1 FROM sys_code_mapping WHERE code_key=? AND code_value=?').get(k,v))
      db.prepare('INSERT INTO sys_code_mapping (code_key,code_value,label,sort_order) VALUES (?,?,?,?)').run(k,v,l,s);
  });

  // 流入経路
  [
    ['AKICON','アキコン（Web）'],
    ['TEL','電話'],
    ['SHOKAI','紹介'],
    ['EVENT','イベント'],
    ['SNS','SNS'],
    ['OTHER','その他'],
  ].forEach(([c,s]) =>
    db.prepare('INSERT OR IGNORE INTO apl_inquiry_source (code,source) VALUES (?,?)').run(c,s)
  );

  // サンプル問い合わせ
  const inqs = [
    {id:'INQ-2024-001',handling_date:'2024-11-01 10:00:00',handling_status:'03',customer_name:'田中 幸子',name_furigana:'タナカ サチコ',current_region:'東京都世田谷区',phone_number:'090-1234-5678',contact_email:'tanaka@example.com',apl_source:'AKICON',apl_rank:'A',report_sts:'01'},
    {id:'INQ-2024-002',handling_date:'2024-11-15 14:30:00',handling_status:'02',customer_name:'鈴木 一郎',name_furigana:'スズキ イチロウ',current_region:'神奈川県横浜市',phone_number:'080-9876-5432',contact_email:'',apl_source:'TEL',apl_rank:'B',report_sts:'00'},
    {id:'INQ-2024-003',handling_date:'2024-12-01 09:15:00',handling_status:'01',customer_name:'山本 花子',name_furigana:'ヤマモト ハナコ',current_region:'大阪府大阪市',phone_number:'070-1111-2222',contact_email:'yamamoto@example.com',apl_source:'AKICON',apl_rank:'C',report_sts:'00'},
    {id:'INQ-2024-004',handling_date:'2024-12-10 11:00:00',handling_status:'01',customer_name:'佐藤 健太',name_furigana:'サトウ ケンタ',current_region:'愛知県名古屋市',phone_number:'052-123-4567',contact_email:'sato@example.com',apl_source:'SHOKAI',apl_rank:'B',report_sts:'00'},
    {id:'INQ-2025-001',handling_date:'2025-01-05 10:30:00',handling_status:'02',customer_name:'中村 洋子',name_furigana:'ナカムラ ヨウコ',current_region:'静岡県浜松市',phone_number:'053-456-7890',contact_email:'nakamura@example.com',apl_source:'AKICON',apl_rank:'S',report_sts:'01'},
  ];
  const insInq = db.prepare('INSERT OR IGNORE INTO apl_inquiry_management (id,handling_date,handling_status,customer_name,name_furigana,current_region,phone_number,contact_email,apl_source,apl_rank,report_sts) VALUES (@id,@handling_date,@handling_status,@customer_name,@name_furigana,@current_region,@phone_number,@contact_email,@apl_source,@apl_rank,@report_sts)');
  const insMst = db.prepare('INSERT OR IGNORE INTO apl_inquiry_master (id,inquiry_id,question_key,answer_val) VALUES (?,?,?,?)');
  inqs.forEach(inq => {
    insInq.run(inq);
    [['Q1','1'],['Q2','東京都'],['Q3','1'],['Q5','3'],['Q6','5'],['Q10','1'],
     ['Q11(4)-1','1600005'],['Q11(4)-2','東京都新宿区'],['Q11(4)-3','1-2-3'],
     ['Q12(1)',inq.customer_name],['Q12(3)',inq.phone_number],['Q13(1)-1','1']
    ].forEach(([k,v],i) => insMst.run(`${inq.id}-M${i}`,inq.id,k,v));
  });

  // サンプル帳票送付
  db.prepare('INSERT OR IGNORE INTO apl_report_send (id,inquiry_id,delivery_mod,send_sts,sent_date,file_name) VALUES (?,?,?,?,?,?)').run(
    'RPT-001','INQ-2024-001','1','01','2024-11-10 10:00:00','相場レポート_田中様.pdf'
  );
  db.prepare('INSERT OR IGNORE INTO apl_report_send (id,inquiry_id,delivery_mod,send_sts,sent_date,file_name) VALUES (?,?,?,?,?,?)').run(
    'RPT-002','INQ-2025-001','1','01','2025-01-10 09:00:00','相場レポート_中村様.pdf'
  );

  // 対応履歴
  [
    ['HST-001','INQ-2024-001','2024-11-02 10:00:00','初回電話対応。物件確認の希望あり。'],
    ['HST-002','INQ-2024-001','2024-11-08 14:00:00','現地調査実施。築35年。'],
    ['HST-003','INQ-2025-001','2025-01-06 09:00:00','メールにて詳細ヒアリング実施。'],
  ].forEach(([id,inqId,date,content]) =>
    db.prepare('INSERT OR IGNORE INTO biz_progress_history (id,inquiry_id,action_date,action_content) VALUES (?,?,?,?)').run(id,inqId,date,content)
  );

  // サンプル協力業者
  [
    {id:'BIZ-001',record_no:'R001',record_type:'1',partner_rank:'A',industry:'01',company_name:'株式会社解体プロ',representative_name:'佐藤 太郎',prefecture:'13',tel:'03-1234-5678',email:'sato@kaitai-pro.co.jp',service_area:'01',registration_date:'2024-01-15 00:00:00'},
    {id:'BIZ-002',record_no:'R002',record_type:'1',partner_rank:'B',industry:'02',company_name:'クリーンサービス東京',representative_name:'山田 花子',prefecture:'13',tel:'03-9876-5432',email:'yamada@clean-tokyo.co.jp',service_area:'01',registration_date:'2024-03-20 00:00:00'},
    {id:'BIZ-003',record_no:'R003',record_type:'2',partner_rank:'A',industry:'03',company_name:'不動産査定センター',representative_name:'中村 健',prefecture:'27',tel:'06-1111-2222',email:'nakamura@satei.co.jp',service_area:'02',registration_date:'2024-06-01 00:00:00'},
  ].forEach(r =>
    db.prepare('INSERT OR IGNORE INTO biz_partner_info (id,record_no,record_type,partner_rank,industry,company_name,representative_name,prefecture,tel,email,service_area,registration_date) VALUES (@id,@record_no,@record_type,@partner_rank,@industry,@company_name,@representative_name,@prefecture,@tel,@email,@service_area,@registration_date)').run(r)
  );

  // サンプル見込み顧客
  [
    {id:'POT-001',temp_id:'POT-001',handling_status:'02',reception_date:'2025-01-10 10:00:00',pot_source:'AKICON',pot_rank:'A',certainty:'80',inquiry_id:'INQ-2025-001'},
    {id:'POT-002',temp_id:'POT-002',handling_status:'01',reception_date:'2025-02-01 09:00:00',pot_source:'TEL',pot_rank:'B',certainty:'50',inquiry_id:'INQ-2024-002'},
  ].forEach(r => {
    db.prepare('INSERT OR IGNORE INTO pot_potential_master (id,temp_id,handling_status,reception_date,pot_source,pot_rank,certainty,inquiry_id) VALUES (@id,@temp_id,@handling_status,@reception_date,@pot_source,@pot_rank,@certainty,@inquiry_id)').run(r);
    db.prepare('INSERT OR IGNORE INTO pot_customer_info (id,pot_id,consultant_name,furigana,phone_number,email_address,current_residence) VALUES (?,?,?,?,?,?,?)').run(
      `POTC-${r.id}`, r.id,
      r.id==='POT-001'?'中村 洋子':'鈴木 一郎',
      r.id==='POT-001'?'ナカムラ ヨウコ':'スズキ イチロウ',
      r.id==='POT-001'?'053-456-7890':'080-9876-5432',
      r.id==='POT-001'?'nakamura@example.com':'',
      r.id==='POT-001'?'静岡県浜松市':'神奈川県横浜市'
    );
    db.prepare('INSERT OR IGNORE INTO pot_real_estate_summary (id,pot_id,location,vacant_years) VALUES (?,?,?,?)').run(
      `POTR-${r.id}`, r.id,
      r.id==='POT-001'?'静岡県浜松市中区':'神奈川県横浜市港北区', '3'
    );
  });

  // サンプル施工業者（顧客）
  [
    {id:'PRO-001',status:'02',reception_date:'2025-01-15 10:00:00',pot_id:'POT-001',consultant_name:'中村 洋子',furigana:'ナカムラ ヨウコ',case_source:'AKICON',tel:'053-456-7890',email_address:'nakamura@example.com',residence_area:'静岡県浜松市'},
    {id:'PRO-002',status:'01',reception_date:'2025-02-10 09:00:00',pot_id:'POT-002',consultant_name:'鈴木 一郎',furigana:'スズキ イチロウ',case_source:'TEL',tel:'080-9876-5432',email_address:'',residence_area:'神奈川県横浜市'},
  ].forEach(r =>
    db.prepare('INSERT OR IGNORE INTO pro_contractor_info (id,status,reception_date,pot_id,consultant_name,furigana,case_source,tel,email_address,residence_area) VALUES (@id,@status,@reception_date,@pot_id,@consultant_name,@furigana,@case_source,@tel,@email_address,@residence_area)').run(r)
  );
});

const cnt = db.prepare('SELECT COUNT(*) as c FROM users').get();
seedData();
console.log('✅ DB初期化完了');

module.exports = db;
