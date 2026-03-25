<template>
  <el-form
    label-width="80px"
    :rules="rules"
    :model="addRow"
    :inline="true"
    :label-position="labelPosition"
    ref="addRowRef">
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">契約者情報</span>（お客様情報登録シート返送時、内容反映必須）</span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="対応状況" prop="status">
          <elx-select v-model="addRow.status" selectKey="SCM_CUS_RESP_STATUS" class="width-zoom-2">
          </elx-select>
        </el-form-item>
        <el-form-item label="受付日" prop="receptionDate">
          <el-date-picker
            v-model="addRow.receptionDate"
            type="datetime"
            style="width: var(--width-zoom);"
            >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件担当者" prop="potManagerWorker">
          <el-input
            v-model="addRow.caseHandler"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectUserWorkerDialog" />
          </template>
          </el-input>
        </el-form-item>
        <el-form-item label="案件ID" prop="potId">
          <el-input
            v-model="addRow.potId"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectDialog" />
          </template>
          </el-input>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container">
        <el-form-item label="顧客ID" prop="customerId">
          <el-input v-model="addRow.customerId" maxlength="36" class="width-zoom-1" :disabled=true></el-input>
        </el-form-item>
        <el-form-item label="相談者名" prop="consultantName">
          <el-input v-model="addRow.consultantName" maxlength="80" class="width-zoom-1">
          </el-input>
        </el-form-item>
        <el-form-item label="ひらがな" prop="furigana">
          <el-input v-model="addRow.furigana" maxlength="255" class="width-zoom-1">
          </el-input>
        </el-form-item>
        </div>
        <div class="dynamic-container">
          <el-form-item label="案件流入経路" prop="caseSource">
          <elx-select v-model="addRow.caseSource"
                      selectUrl="/apl/qryAplInquirySource"
                      keyName ="code" 
                      labelName ="source"
                     　class="width-zoom-2">
          </elx-select>
        </el-form-item>
        <el-form-item label="案件流入詳細" prop="caseDetails"><el-input v-model="addRow.caseDetails" maxlength="200" class="width-zoom-1"></el-input></el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="TEL" prop="tel">
          <el-input
            v-model="addRow.tel"
            maxlength="20"
            class="width-zoom-1"
            @blur="formatTelNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="携帯番号" prop="mobileNumber">
          <el-input 
            v-model="addRow.mobileNumber" 
            maxlength="20" 
            class="width-zoom-1"
            @blur="formatMobileNumber"
          ></el-input>
        </el-form-item>
        <el-form-item label="メールアドレス" prop="emailAddress">
          <el-input v-model="addRow.emailAddress" maxlength="320" class="width-zoom-2"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="居住地域 郵便番号" prop="residencePostalCode">
          <el-input v-model="addRow.residencePostalCode" maxlength="32" class="width-zoom-1" @blur="formatPostalCode"></el-input>
        </el-form-item>
        <el-form-item label="居住地域" prop="residenceArea">
          <el-input v-model="addRow.residenceArea" maxlength="500" class="width-zoom-1"></el-input>
        </el-form-item>
        <el-form-item label="居住地 住所（書面郵送先）" prop="residenceAddress">
          <el-input v-model="addRow.residenceAddress" maxlength="500" class="width-zoom-2"></el-input>
        </el-form-item>
        <el-form-item label="書面郵送　宛名" prop="postalAddress">
          <el-input v-model="addRow.postalAddress" class="width-zoom-1"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="希望連絡方法" prop="preferredContactMethod">
            <elx-checkbox-group v-model="addRow.preferredContactMethod" selectKey="SCM_PREFERRED_CONTACT_METHOD" groupName="gtpName"></elx-checkbox-group>
        </el-form-item>
        <el-form-item label="連絡可能曜日" prop="availableDays">
          <elx-radio-group
            v-model="addRow.availableDays"
            selectKey="SCM_AVAILABLE_DAYS_FOR_CONTACT"
            groupName="gtpName2">
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="その他の場合" prop="otherConditions">
          <el-input v-model="addRow.otherConditions" maxlength="32" :disabled="!addRow.availableDays?.includes('2')" class="width-zoom-1"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="連絡可能時間" prop="availableTime">
            <elx-checkbox-group v-model="addRow.availableTime" selectKey="SCM_CONTACT_HOURS" groupName="gtpName"  ></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="備考" prop="notes">
          <el-input v-model="addRow.notes" maxlength="500" type="textarea" class="width-zoom-textarea"></el-input>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">契約情報</span></span></template>
      <!-- <div class="dynamic-container-top dynamic-container">
        <el-form-item label="Q13 所有地の住居表示＊" prop="residenceAddress">
          <el-input v-model="addContractInfoRow.residenceAddress" maxlength="32" class="width-zoom-2"></el-input>
        </el-form-item>
      </div> -->
      <div class="dynamic-container">
        <el-form-item label="土地謄本 所有者名" prop="landRegistryOwnerName">
          <el-input v-model="addContractInfoRow.landRegistryOwnerName" maxlength="255" class="width-zoom-1"></el-input>
        </el-form-item>
        <el-form-item label="土地謄本 地番" prop="landRegistryLotNumber">
          <el-input v-model="addContractInfoRow.landRegistryLotNumber" maxlength="255" class="width-zoom-3"></el-input>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">契約書詳細</span></div>
      <div class="dynamic-container">
        <el-form-item label="契約者名" prop="contractorName">
          <el-input v-model="addContractInfoRow.contractorName" maxlength="32" class="width-zoom-1"></el-input>
        </el-form-item>
        <el-form-item label="契約書発送先" prop="contractShipmentAddress">
          <el-input v-model="addContractInfoRow.contractShipmentAddress" maxlength="32" class="width-zoom-2"></el-input>
        </el-form-item>
        <el-form-item label="宛名" prop="addressee">
          <el-input v-model="addContractInfoRow.addressee" maxlength="500" class="width-zoom-1"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="コンサル契約書" prop="consultContract">
          <elx-select v-model="addRow.consultContract" selectKey='SCM_CONSULTANCY_AGREEMENT_STAGE' class="width-zoom-1">
          </elx-select>
        </el-form-item>
        <el-form-item label="コンサル契約書発送日" prop="consultingContractShipmentDate">
          <el-date-picker
            v-model="addContractInfoRow.consultingContractShipmentDate"
            type="date" style="width: var(--width-zoom-1);">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="コンサル契約日" prop="consultingContractDate">
            <el-date-picker
            v-model="addSupportContentRow.consultingContractDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="コンサル売上" prop="consultingRevenue">
            <div class="input-with-suffix">
              <el-input 
              v-model.number="addSupportContentRow.consultingRevenue"
              class="width-zoom-1"
              :formatter="formatMoney"
              :parser="parseMoney"
              prop="consultingRevenue"/>
            </div>
          </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="内金案内" prop="depositAnnouncement">
          <elx-select v-model="addContractInfoRow.depositAnnouncement" selectKey="SCM_DEPOSIT_INFORMATION" class="width-zoom-1">
          </elx-select>
        </el-form-item>
        <el-form-item label="内金請求書" prop="depositInvoice">
          <elx-select v-model="addContractInfoRow.depositInvoice"   selectKey="SCM_INVOICE_TYPE"  class="width-zoom-1">
          </elx-select>
        </el-form-item>
        <el-form-item label="内金金額" prop="depositAmount">
          <div class="input-with-suffix">
            <el-input 
              v-model.number="addContractInfoRow.depositAmount"
              class="width-zoom-1"
              :formatter="formatMoney"
              :parser="parseMoney"
              prop="depositAmount"/>
          </div>
        </el-form-item>
        <el-form-item label="内金入金日" prop="depositPaymentDate">
          <el-date-picker
            v-model="addContractInfoRow.depositPaymentDate"
            type="date" style="width: var(--width-zoom-1);">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container">
          <el-form-item label="完了予定日" prop="estimatedCompletionDate">
            <el-date-picker
            v-model="addSupportContentRow.estimatedCompletionDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="実績完了日" prop="actualCompletionDate">
            <el-date-picker
            v-model="addSupportContentRow.actualCompletionDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="請求書送付日" prop="invoiceShipmentDate">
            <el-date-picker
            v-model="addSupportContentRow.invoiceShipmentDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入金予定日" prop="expectedPaymentDate">
            <el-date-picker
            v-model="addSupportContentRow.expectedPaymentDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="dynamic-container">
          <el-form-item label="入金日" prop="paymentDate">
            <el-date-picker
            v-model="addSupportContentRow.paymentDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="領収書送付日" prop="receiptShipmentDate">
            <el-date-picker
            v-model="addSupportContentRow.receiptShipmentDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>

          <el-form-item label="お客様アンケート送付日" prop="customerSurveyShipmentDate">
            <el-date-picker
            v-model="addSupportContentRow.customerSurveyShipmentDate"
            type="date" style="width: var(--width-zoom-1);">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="お客様アンケート返送有無" prop="customerSurveyReturned">
            <elx-select v-model="addSupportContentRow.customerSurveyReturned" selectKey="SCM_CUSTOMER_SURVEY_RETURN_STATUS" class="width-zoom-1">
            </elx-select>
          </el-form-item>
        </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">サポート詳細</span></span></template>
      <div class="dynamic-container-top dynamic-container" style="margin-bottom: 10px;">
        <el-form-item label="サポート売上">
          <TableAddDocSupport :tableColumns="addDocTableColumnsSupport"
                              :tableUrl="tableUrlAddDoc"
                              :tableDataVal="tableDataSupport"
                              ref="tableComtRefAddDocSupport"/>
          </el-form-item>
      </div>
      <!-- <el-divider></el-divider> -->
      <!-- <div class="dynamic-container" style="margin-bottom: 30px;">
        <el-form-item label="サポート売上（実績）">
          <TableAddDocSupportJissai :tableColumns="addDocTableColumnsSupportJissai"
                              :tableUrl="tableUrlAddDoc"
                              :tableDataVal="[{supportItem: '', selectKey: 'SCM_SUPPORT_ITEMS1'}, {supportItem: '', selectKey: 'SCM_SUPPORT_ITEMS2'}, {supportItem: '', selectKey: 'SCM_SUPPORT_ITEMS2'}]"
                              ref="tableComtRefAddDocSupportJissai"
                              :hideOperations="true"
                              :hideAddButton="true"/>
         </el-form-item>
      </div> -->
      <el-divider></el-divider>
      <!-- <div class="dynamic-container">
        <el-form-item label="サポート合計売上" prop="supportTotalSales">
            <div class="input-with-suffix">
              <span class="suffix-text"  style="padding: 0px 5px 0px 0px;">¥</span>
              <el-input v-model="supportTotalSales" :disabled="true" class="width-zoom-1"></el-input>
            </div>
        </el-form-item>
        <el-form-item label="コンサルサポート合計売上" prop="consultSupportTotalSales">
            <div class="input-with-suffix">
              <span class="suffix-text"  style="padding: 0px 5px 0px 0px;">¥</span>
              <el-input v-model="consultSupportTotalSales" :disabled="true" class="width-zoom-1"></el-input>
            </div>
        </el-form-item>
      </div> -->
      <div class="dynamic-container">
        <el-form-item label="サポート合計売上" prop="supportTotalSalesDoing">
            <div class="input-with-suffix">
              <span class="suffix-text"  style="padding: 0px 5px 0px 0px;">¥</span>
              <el-input v-model="supportTotalSalesDoing" :disabled="true" class="width-zoom-1"></el-input>
            </div>
        </el-form-item>
        <el-form-item label="コンサルサポート合計売上" prop="consultSupportTotalSalesDoing">
            <div class="input-with-suffix">
              <span class="suffix-text"  style="padding: 0px 5px 0px 0px;">¥</span>
              <el-input v-model="consultSupportTotalSalesDoing" :disabled="true" class="width-zoom-1"></el-input>
            </div>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">案件支出</span></span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item>
          <div class="width-zoom-5">
          <!-- :tableUrl="tableUrlAddDoc" -->
            <TableAddProject
              :tableColumns="addDocTableColumnsProject"
              ref="tableComtRefAddDocProject"
              :tableDataVal="tableDataExpenditure"
            />
          </div>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件支出合計" prop="ankenShishutsuGokei">
            <div class="input-with-suffix">
              <span class="suffix-text"  style="padding: 0px 5px 0px 0px;">¥</span>
              <el-input
                v-model.number="ankenShishutsuGokei"
                class="width-zoom-1"
                :formatter="formatNumber"
                :parser="parseNumber"
                :disabled="true"/>
            </div>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">案件収支</span></span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="案件収支合計" prop="totalCaseProfit">
            <div class="input-with-suffix">
              <span class="suffix-text"  style="padding: 0px 5px 0px 0px;">¥</span>
              <el-input v-model="addRow.totalCaseProfit" :disabled="true" class="width-zoom-1"></el-input>
            </div>
        </el-form-item>
        <el-form-item label="案件粗利率" prop="grossMarginRate">
            <div class="input-with-suffix">
              <el-input v-model="addRow.grossMarginRate" :disabled="true" class="width-zoom-1"></el-input>
              <span class="suffix-text"  style="padding: 0px 0px 0px 5px;">%</span>
            </div>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">進捗管理</span></span></template>
      <div class="width-history-2">
        <!-- :tableDataVal="tableDataHistory" -->
            <!-- :tableUrl="tableUrlAddDoc" -->
        <el-form-item label="進捗状況">
          <TableAddDoc 
            v-if="showTableAddDoc"
            :tableColumns="addDocTableColumns"
            bizDataType="pot"
            :bizDataNo="addRow.potId"
            ref="tableComtRefAddDoc"
          />
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="次回アクション" prop="nextAction">
          <el-input v-model="addRow.nextAction" maxlength="32" class="width-zoom-2"></el-input>
        </el-form-item>
        <el-form-item label="日付" prop="date">
          <el-date-picker
            v-model="addRow.date"
            type="date" style="width: var(--width-zoom-1);">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="時刻" prop="time" class="width-zoom-1">
          <el-time-picker
            v-model="addRow.time">
          </el-time-picker>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">営業活動報告書</span></div>
      <div class="dynamic-container">
          <el-form-item label="報告書作成" prop="reportCreation">
            <elx-radio-group v-model="addRow.reportCreation" selectKey="SCM_REPORT_CREATION_STATUS" groupName="gtpName" ></elx-radio-group>
          </el-form-item>
          <el-form-item label="有の場合、作成開始月" prop="ifApplicableCreationStartMonth">
            <el-input v-model="addRow.ifApplicableCreationStartMonth" :disabled="!addRow.reportCreation?.includes('2')" class="width-zoom-1"></el-input>
          </el-form-item>
        </div>
        <div class="width-report-1">
          <!-- :tableDataVal="tableDataReport" :tableUrl="tableUrlAddDoc" -->
          <TableAddDocReport :tableColumns="addDocTableColumnsReport"
                           ref="tableComtRefAddDocReport"/>
        </div><p/>
    </el-card>
    <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">一時的ボタンエリア</span></template>
      <div class="dynamic-container" >
        <el-button type="primary" @click="save" :loading="loadingSave">保存</el-button>
      </div>
    </el-card> -->
    <div class="detail-btn-group-cls">
        <el-button type="primary" @click="save" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
      </div>
    <!-- 跳转用户选择 -->
    <el-dialog v-model="selectDialogVisible" title="見込み顧客を選択してください" width="60%" heigth="80%">
      <potPotentialList  @select-element="handleSelectElement" :isshowBtn="false" :fromPotential="true" ref="potPotentialRef"/>
    </el-dialog>
    <el-dialog v-model="selectUserWorkerDialogVisible" title="案件担当者を選択してください" width="60%" heigth="80%">
      <sysUserList  @select-userWorker="handleSelectUser" :isshowBtn="false" :fromPotential="true" :userKbn="3" ref="sysUserRef"/>
    </el-dialog>
  </el-form>
</template>

<script lang="ts" setup>
import TableAddProject from '@/components/TableCommAddDoc.vue'
import TableAddDoc from '@/components/TableCommAddDoc.vue'
import TableAddDocSupport from '@/components/TableCommAddDoc.vue'
import TableAddDocSupportJissai from '@/components/TableCommAddDoc.vue'
import TableAddDocReport from '@/components/TableCommAddDoc.vue'
import {defineProps, defineEmits, reactive, ref, onMounted, watch} from 'vue';
// import axios from 'axios' // 引入 axios
import {useFetch} from '#app'
import {ElMessage, ElMessageBox} from 'element-plus'
import type { ComponentSize, FormProps } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import potPotentialList from '@/pages/pot/potPotentialList.vue'
import sysUserList from '@/pages/sys/sysUserList.vue'
import '~/assets/css/app.css';
import { validateForm } from '@/utils/formValidation';
const showTableAddDoc = ref(true);


const tableDataSupport = ref<[]>([]);
const tableDataExpenditure = ref<[]>([]);
const tableDataHistory = ref<[]>([]);

const tableUrlAddDoc = ref("");
const labelPosition = ref<FormProps['labelPosition']>('top');
const loadingSave = ref(false);
const addRowRef = ref();
const {$api} = useNuxtApp()
const damiAddress = ref('');
const tableComtRefAddDoc = ref(null);
const tableComtRefAddDocSupport = ref(null);
const tableComtRefAddDocReport = ref(null);
const tableComtRefAddDocProject = ref(null);
const ankenExpensesTotal = ref(0);
const depositAmount = ref('')
const consultingRevenue = ref('')
const consultantItakuryo = ref<number | string>('');
const akiconShokairyo = ref<number | string>('');
const tableComtRefAddDocSupportJissai = ref<any>(null);
const supportTotalSales = ref('0');
const consultSupportTotalSales = ref('0');
const supportTotalSalesDoing = ref('0');
const consultSupportTotalSalesDoing = ref('0');
const ankenShishutsuGokei = ref(0);

// サポート合計売上を計算する関数
const calculateSupportTotalSales = () => {
  const tableData = tableComtRefAddDocSupportJissai.value?.getTableData() || [];
  const total = tableData.reduce((sum: number, row: any) => {
    return sum + (Number(row.orderAmount) || 0);
  }, 0);
  supportTotalSales.value = String(total);
};

// サポート合計売上を計算する関数
const calculateConsultSupportTotalSales = () => {
  const supportTotal = Number(supportTotalSales.value) || 0;
  const consultingTotal = Number(consultingRevenue.value) || 0;
  const total = supportTotal + consultingTotal;
  consultSupportTotalSales.value = String(total);
};

// 案件支出合計を計算する関数を追加
const calculateAnkenShishutsuGokei = () => {
  if (!tableComtRefAddDocProject.value) return;
  const tableData = tableComtRefAddDocProject.value.getTableData();
  const total = tableData.reduce((sum, row) => {
    const fee = parseFloat(row.fee || 0);
    return sum + fee;
  }, 0);
  ankenShishutsuGokei.value = total;
};

const formatNumber = (value: number | string) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// const formatTelNumber = () => {
//   const numbers = addRow.tel.replace(/[^0-9]/g, '');
//   if (numbers.length === 10) {
//     addRow.tel = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
//   } else if (numbers.length === 11) {
//     addRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
//   }
// };
const formatTelNumber = () => {
  return;
  const numbers = addRow.tel.replace(/[^0-9]/g, '');

  if (numbers.length === 11) {
    // 手机格式，如 090-1234-5678
    addRow.tel = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 10) {
    if (numbers.startsWith('03') || numbers.startsWith('06')) {
      // 东京都区部、大阪，格式如 03-1234-5678
      addRow.tel = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('011') || numbers.startsWith('045') || numbers.startsWith('092')) {
      // 北海道、横滨、福冈等地，格式如 011-123-4567
      addRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    } else {
      // 默认 fallback：3-3-4（不准确但安全）
      addRow.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
  }
};

const formatMobileNumber = () => {
  return;
  if (!addRow.mobileNumber) return;
  
  // 数字のみを抽出
  const numbers = addRow.mobileNumber.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    addRow.mobileNumber = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
};

const parseNumber = (value: string) => {
  return value.replace(/,/g, '');
};

const addDocTableColumns = [
  { prop: 'actionDate', label: '日付', inTyp: 'date', width: '160'},
  { prop: 'actionContent', label: '内容' , inTyp: 'textarea', width: '700'},
]

const addDocTableColumnsProject = [
  { prop: 'expenseType', label: '支出種類', inTyp: 'select', selectKey: 'SCM_EXPENSE_TYPES', width: '230'},
  { prop: 'fee', label: '料金', inTyp: 'money'},
  { prop: 'payee', label: '支払先' , inTyp: 'text'},
  { prop: 'paymentDate', label: '支払日' , inTyp: 'date', width: '160'},
]

// const addDocTableColumnsSupportJissai = [
//   { prop: 'supportItem', label: 'サポート項目', inTyp: 'select', width: '210', selectKey: (row) => row.selectKey || 'SCM_SUPPORT_ITEMS2'},
//   { prop: 'scheduledDate', label: '実施予定日' , inTyp: 'date'},
//   { prop: 'actualDate', label: '実績実施日' , inTyp: 'date'},
//   { prop: 'orderAmount', label: '受注金額', inTyp: 'money'},
//   { prop: 'billingAddress', label: '請求先' , inTyp: 'select'},
//   { prop: 'invoiceShipmentDate', label: '請求書送付日' , inTyp: 'date'},
//   { prop: 'paymentDate', label: '入金日' , inTyp: 'date'},
//   { prop: 'receiptShipmentDate', label: '領収書送付日' , inTyp: 'date'},
// ]

const addDocTableColumnsSupport = [
  { prop: 'supportItem', label: 'サポート項目' , inTyp: 'select', selectKey: 'SCM_SUPPORT_ITEMS', width: '240' },
  { prop: 'orderAmount', label: '受注金額' , inTyp: 'money', width: '120'},
  { prop: 'billingAddress', label: '請求先' , inTyp: 'select', selectUrl: "/biz/partner/info/list", keyName: "id", labelName: "companyName", },
  { prop: 'workInfo', label: '作業内容など詳細' , inTyp: 'textarea', width: '160'},
  { prop: 'invoiceShipmentDate', label: '請求書送付日' , inTyp: 'date'},
  { prop: 'paymentDate', label: '入金日' , inTyp: 'date'},
  { prop: 'receiptShipmentDate', label: '領収書送付日' , inTyp: 'date'},
]

const addDocTableColumnsReport = [
  { prop: 'followCount', label: '回数' , inTyp: 'text', width: '120'},
  { prop: 'sendDate', label: '発送日' , inTyp: 'date', width: '160'},
  { prop: 'remarks', label: '備考' , inTyp: 'textarea', width: '700'},
]

const addRow = reactive({
  id: "", 
  potId: "", 
  status: "", 
  receptionDate: "", 
  caseHandler: "", 
  customerId: "", 
  consultantName: "", 
  furigana: "", 
  caseSource: "", 
  caseDetails: "", 
  tel: "", 
  mobileNumber: "", 
  emailAddress: "", 
  residencePostalCode: "", 
  residenceArea: "", 
  residenceAddress: "", 
  preferredContactMethod: "", 
  availableDays: "", 
  otherConditions: "", 
  availableTime: "",
  notes: "", 
  totalCaseProfit: "", 
  grossMarginRate: "", 
  reportCreation: "", 
  ifApplicableCreationStartMonth: "", 
  nextAction: "", 
  date: "", 
  time: "",
  consultContract: "",
  postalAddress: "",
});

const formatPostalCode = () => {
  if (!addRow.residencePostalCode) return;
  const numbers = addRow.residencePostalCode.replace(/[^0-9]/g, '');
  if (numbers.length === 7) {
    addRow.residencePostalCode = numbers.slice(0, 3) + '-' + numbers.slice(3);
  }
};

const addContractInfoRow = reactive({
  id:"",
  proId:"",
  residenceAddress:"",
  landRegistryOwnerName:"",
  landRegistryLotNumber:"",
  contractorName:"",
  contractShipmentAddress:"",
  addressee:"",
  consultingContractShipmentDate:"",
  depositAnnouncement:"",
  depositAmount: 0,
  depositPaymentDate:"",
  consultContract:"",
  depositInvoice:"",
});

const addSupportContentRow = reactive({
  id: "",
  proId: "",
  landRegistryLotNumber: "",
  consultingContractDate: "",
  estimatedCompletionDate: "",
  actualCompletionDate: "",
  consultingRevenue: 0,
  invoiceShipmentDate: "",
  expectedPaymentDate: "",
  paymentDate: "",
  receiptShipmentDate: "",
  customerSurveyShipmentDate: "",
  customerSurveyReturned: "",
});

// TableAddDocSupportのデータ変更を監視
watch(() => tableComtRefAddDocSupport.value?.getTableData(), (newVal) => {
  if (newVal) {
    const total = newVal.reduce((sum, row) => {
      return sum + (Number(row.orderAmount) || 0);
    }, 0);
    supportTotalSalesDoing.value = total.toString();
  } else {
    supportTotalSalesDoing.value = '0';
  }
}, { deep: true });

// コンサル売上とサポート合計売上の変更を監視
watch([consultSupportTotalSales, supportTotalSalesDoing, supportTotalSales], () => {
  const consult = Number(consultSupportTotalSales.value || 0);
  const doing = Number(supportTotalSalesDoing.value || 0);
  const total = Number(supportTotalSales.value || 0);
  consultSupportTotalSalesDoing.value = String(consult + doing - total);
}, { deep: true });

// TableAddDocSupportJissaiのデータ変更を監視
watch(() => tableComtRefAddDocSupportJissai.value?.getTableData(), calculateSupportTotalSales, { deep: true });

// コンサル売上とサポート合計売上の変更を監視
watch([supportTotalSales, consultingRevenue], calculateConsultSupportTotalSales, { deep: true });

// 案件収支合計を計算する関数
const calculateTotalCaseProfit = () => {
  const totalSales = Number(consultSupportTotalSales.value || 0);
  const totalExpenses = Number(ankenShishutsuGokei.value || 0);
  addRow.totalCaseProfit = String(totalSales - totalExpenses);
  
  // 案件粗利率の計算（売上がある場合のみ）
  if (totalSales > 0) {
    // 案件粗利率 = 案件収支合計 / コンサルサポート合計売上
    const profitRate = (Number(addRow.totalCaseProfit) / totalSales) * 100;
    addRow.grossMarginRate = profitRate.toFixed(1);
  } else {
    addRow.grossMarginRate = "0";
  }
};

/// コンサルサポート合計売上と案件支出合計の変更を監視して案件収支合計を計算
watch([consultSupportTotalSales, ankenShishutsuGokei], calculateTotalCaseProfit, { deep: true });

// コンポーネントマウント時に初期計算
onMounted(() => {
  calculateSupportTotalSales();
  calculateConsultSupportTotalSales();
  calculateTotalCaseProfit();

  const tableData = tableComtRefAddDocSupport.value?.getTableData();
  if (tableData) {
    const total = tableData.reduce((sum, row) => {
      return sum + (Number(row.orderAmount) || 0);
    }, 0);
    supportTotalSalesDoing.value = total.toString();
    consultSupportTotalSalesDoing.value = (total + Number(consultingRevenue.value || 0)).toString();
  }
});

// テーブルデータの変更を監視
watch(() => tableComtRefAddDocProject.value?.getTableData(), () => {
  calculateAnkenShishutsuGokei();
}, { deep: true });

// addSupportContentRowのコンサル売上の変更を監視
watch(() => addSupportContentRow.consultingRevenue, (newVal) => {
  consultingRevenue.value = newVal;
});

const potManagerWorkerSearch = () => {
    console.log('検索内容:', addRow.potManagerWorker)
}

onMounted(() => {
});
const formatMoney = (value: number) => {
  if (!value) return '¥0';
  return `¥${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const parseMoney = (value: string) => {
  if (!value) return '';
  return value.replace(/¥\s?|(,*)/g, '');
};
const props = defineProps({
  addUrl: String,
});

const emit = defineEmits(['save', 'close']);

const save = async () => {
  
  loadingSave.value = true;
  // ここでバリデーションを実行
  const isValid = await validateForm(addRowRef.value);
  if (!isValid) {
    loadingSave.value = false;
    return;
  }
  try {
    const response = await useNuxtApp().$api(props.addUrl, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: {
        proContractorInfo: addRow,
        proContractInfo: addContractInfoRow,
        proSupportContent: addSupportContentRow,
        proCaseExpensesList : tableComtRefAddDocProject.value.getTableData(),
        bizProgressHistoryList: tableComtRefAddDoc.value.getTableData(),
        proSupportDetailsList: tableComtRefAddDocSupport.value.getTableData(),
        proActivityReportList: tableComtRefAddDocReport.value.getTableData(),
      }
    })

    if (response.success) {
      emit('save', response);
      return;
    }
    ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
  } catch (error) {
    ElMessage({type: 'error', message: 'Failed to retrieve data: '+error, style: 'z-index: 3000;'});
  }finally {
    loadingSave.value = false;
  }
};

const rules = {
  residencePostalCode: [{
    required: false,
    pattern: /^\d{3}-\d{4}$/,
    message: '正しい郵便番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  tel: [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しいTELの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  mobileNumber: [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しい携帯番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  emailAddress: [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
}

// 跳转用户选择
const selectDialogVisible = ref(false)
const openSelectDialog = () => { 
  selectDialogVisible.value = true;
}
const handleSelectElement = (lineData: any) => {
  //意向顧客のID
  addRow.potId = lineData.potPotentialMaster.id; // 修正：移除 .value
  //顧客ID
  addRow.customerId = lineData.potCustomerInfo.customerId;
  //案件流入経路
  addRow.caseSource = lineData.potPotentialMaster.potSource;
  //案件流入詳細
  addRow.caseDetails = lineData.potPotentialMaster.potDetails;
  //相談者名
  addRow.consultantName = lineData.potCustomerInfo.consultantName;
  //フリガナ
  addRow.furigana = lineData.potCustomerInfo.furigana;
  //TEL
  addRow.tel = lineData.potCustomerInfo.phoneNumber;
  //携帯番号
  addRow.mobileNumber = lineData.potCustomerInfo.mobileNumber;
  //メールアドレス
  addRow.emailAddress = lineData.potCustomerInfo.emailAddress;
  //居住地域 郵便番号
  addRow.residencePostalCode = lineData.potCustomerInfo.residencePostalCode;
  //居住地域
  addRow.residenceArea = lineData.potCustomerInfo.currentResidence;
  //居住地 住所（書面郵送先）
  addRow.residenceAddress = lineData.potCustomerInfo.residenceAddress;
  //書面郵送宛名
  addRow.postalAddress = lineData.potCustomerInfo.postalAddress;

  //土地謄本 所有者名
  addContractInfoRow.landRegistryOwnerName = lineData.potRealEstateSummary.landRegistryOwnerName;
  //土地謄本 地番
  addContractInfoRow.landRegistryLotNumber = lineData.potRealEstateSummary.landRegistryLotNumber;

  /* 重载 社内進捗管理 */
  showTableAddDoc.value = false;
  nextTick(() => {
      showTableAddDoc.value = true;
    });


  selectDialogVisible.value = false;
};

const selectUserWorkerDialogVisible = ref(false)
const openSelectUserWorkerDialog = () => { 
  selectUserWorkerDialogVisible.value = true;
}
const handleSelectUser = (userData: any) => {
  addRow.caseHandler = userData.fullName
  selectUserWorkerDialogVisible.value = false
}
</script>

<style scoped>
::v-deep .TableCommAddDoc .el-table__body {
  width: 600px !important;
}

.input-with-suffix .el-input__inner {
  text-align: right;
}

/* .dynamic-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin: 0 auto;
} */

.full-width-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}

/* .el-crd-cls {
  width: 90%;
  margin: 10px auto;
} */

el-form-item {
  flex: 1 1 calc(25% - 16px);
  margin-right:1px;
}

@media screen and (max-width: 768px) {
  el-form-item {
    flex: 1 1 calc(50% - 16px);
  }
}

@media screen and (max-width: 480px) {
  el-form-item {
    flex: 1 1 100%;
  }
}
.manager-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.input-with-suffix {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.suffix-text {
  margin-left: 8px;
}
.next-action-form-item {
  margin-top: 20px;
}
</style>


<!-- 
サポート合計売上
SUM(受注金額+受注金額２+受注金額３)

コンサルサポート合計売上
SUM(コンサル売上+サポート合計売上)

              
案件粗利率
案件収支合計/コンサルサポート合計売上

コンサルサポート合計売上　仮作成中
コンサルサポート合計売上+サポート合計売上 仮作成中-サポート合計売上

案件収支合計
コンサルサポート合計売上-案件支出合計 -->
