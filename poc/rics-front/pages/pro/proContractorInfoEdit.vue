<template>
  <el-form
    label-width="80px"
    :rules="rules"
    :model="detailRow"
    :inline="true"
    :label-position="labelPosition"
    ref="updRowRef">
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">契約者情報</span>（お客様情報登録シート返送時、内容反映必須）</span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="対応状況" prop="status">
          <elx-select v-model="detailRow.proContractorInfo.status" 
          selectKey="SCM_CUS_RESP_STATUS"
          :disabled="isReadOnly"
          class="width-zoom-2">
          </elx-select>
        </el-form-item>
        <el-form-item label="受付日" prop="receptionDate">
          <el-date-picker
            v-model="detailRow.proContractorInfo.receptionDate"
            type="datetime"
            :disabled="isReadOnly"
            style="width: var(--width-zoom);"
            >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件担当者" prop="caseHandler">
          <el-input
            v-model="detailRow.proContractorInfo.caseHandler"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectUserWorkerDialog" :disabled="isReadOnly"/>
          </template>
          </el-input>
        </el-form-item>
        <el-form-item label="案件ID" prop="potId">
          <el-input
            v-model="detailRow.proContractorInfo.potId"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectDialog" :disabled="isReadOnly"/>
          </template>
          </el-input>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container">
        <el-form-item label="顧客ID" prop="customerId">
          <el-input v-model="detailRow.proContractorInfo.customerId" 
          maxlength="32" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="相談者名" prop="consultantName">
          <el-input v-model="detailRow.proContractorInfo.consultantName" 
          maxlength="80" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="フリガナ" prop="furigana">
          <el-input v-model="detailRow.proContractorInfo.furigana" 
          maxlength="20" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件流入経路" prop="caseSource" >
          <elx-select v-model="detailRow.proContractorInfo.caseSource" 
          selectUrl="/apl/qryAplInquirySource"
          keyName ="code" 
          labelName ="source"
          class="width-zoom-2"
          :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="案件流入詳細" prop="caseDetails">
          <el-input v-model="detailRow.proContractorInfo.caseDetails" 
          maxlength="200" 
          class="width-zoom-1"
          :disabled="isReadOnly">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="TEL" prop="proContractorInfo.tel">
          <el-input v-model="detailRow.proContractorInfo.tel" 
          maxlength="20" 
          class="width-zoom-1"
          :disabled="isReadOnly"
          @blur="formatTelNumber"></el-input>
        </el-form-item>
        <el-form-item label="携帯番号" prop="proContractorInfo.mobileNumber">
          <el-input v-model="detailRow.proContractorInfo.mobileNumber" 
          maxlength="20" 
          class="width-zoom-1"
          :disabled="isReadOnly"
          @blur="formatMobileNumber"></el-input>
        </el-form-item>
        <el-form-item label="メールアドレス" prop="proContractorInfo.emailAddress">
          <el-input v-model="detailRow.proContractorInfo.emailAddress" 
          maxlength="320" 
          class="width-zoom-2"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="居住地域 郵便番号" prop="proContractorInfo.residencePostalCode">
          <el-input v-model="detailRow.proContractorInfo.residencePostalCode" 
          maxlength="32" 
          class="width-zoom-1"
          :disabled="isReadOnly"
          @blur="formatPostalCode"></el-input>
        </el-form-item>
        <el-form-item label="居住地域" prop="residenceArea">
          <el-input v-model="detailRow.proContractorInfo.residenceArea" 
          maxlength="500" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="居住地 住所（書面郵送先）" prop="residenceAddress">
          <el-input v-model="detailRow.proContractorInfo.residenceAddress" 
          maxlength="500" 
          class="width-zoom-2"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="書面郵送　宛名" prop="postalAddress">
          <el-input v-model="detailRow.proContractInfo.addressee" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="希望連絡方法" prop="preferredContactMethod">
            <elx-checkbox-group v-model="detailRow.proContractorInfo.preferredContactMethod" 
            selectKey="SCM_PREFERRED_CONTACT_METHOD" 
            groupName="gtpName"
            :disabled="isReadOnly"></elx-checkbox-group>
        </el-form-item>
        <el-form-item label="連絡可能曜日" prop="proContractorInfo.availableDays">
          <elx-radio-group 
            v-model="detailRow.proContractorInfo.availableDays"
            selectKey="SCM_AVAILABLE_DAYS_FOR_CONTACT"
            :disabled="isReadOnly"
            groupName="gtpName2">
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="その他の場合" prop="otherConditions">
          <el-input v-model="detailRow.proContractorInfo.otherConditions" 
          maxlength="32" 
          :disabled="isReadOnly || !detailRow.proContractorInfo.availableDays?.includes('2')" 
          class="width-zoom-1"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="連絡可能時間" prop="availableTime">
            <elx-checkbox-group v-model="detailRow.proContractorInfo.availableTime" 
            selectKey="SCM_CONTACT_HOURS" 
            groupName="gtpName" 
            :disabled="isReadOnly"></elx-checkbox-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="備考" prop="notes">
          <el-input v-model="detailRow.proContractorInfo.notes" 
          maxlength="500" 
          type="textarea" 
          class="width-zoom-textarea"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">契約情報</span></span></template>
      <!-- <div class="dynamic-container-top dynamic-container">
        <el-form-item label="Q13 所有地の住居表示＊" prop="residenceAddress">
          <el-input v-model="detailRow.proContractInfo.residenceAddress" 
          maxlength="32" 
          class="width-zoom-2"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
      </div> -->
      <div class="dynamic-container">
        <el-form-item label="土地謄本 所有者名" prop="landRegistryOwnerName">
          <el-input v-model="detailRow.proContractInfo.landRegistryOwnerName" 
          maxlength="255" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="土地謄本 地番" prop="landRegistryLotNumber">
          <el-input v-model="detailRow.proContractInfo.landRegistryLotNumber" 
          maxlength="255" 
          class="width-zoom-3"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">契約書詳細</span></div>
      <div class="dynamic-container">
        <el-form-item label="契約者名" prop="contractorName">
          <el-input v-model="detailRow.proContractInfo.contractorName" 
          maxlength="32" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="契約書発送先" prop="contractShipmentAddress">
          <el-input v-model="detailRow.proContractInfo.contractShipmentAddress" 
          maxlength="32" 
          class="width-zoom-2"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="宛名" prop="addressee">
          <el-input v-model="detailRow.proContractInfo.addressee" 
          maxlength="500" 
          class="width-zoom-1"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="コンサル契約書" prop="consultContract">
          <elx-select v-model="detailRow.proContractorInfo.consultContract" selectKey='SCM_CONSULTANCY_AGREEMENT_STAGE' class="width-zoom-1">
          </elx-select>
        </el-form-item>
        <el-form-item label="コンサル契約書発送日" prop="consultingContractShipmentDate">
          <el-date-picker
            v-model="detailRow.proContractorInfo.consultingContractShipmentDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="コンサル契約日" prop="consultingContractDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.consultingContractDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="コンサル売上" prop="consultingRevenue">
            <div class="input-with-suffix">
              <el-input 
              v-model.number="detailRow.proSupportContent.consultingRevenue"
              class="width-zoom-1"
              :formatter="formatMoney"
              :parser="parseMoney"
              :disabled="isReadOnly"
              prop="consultingRevenue"/>
            </div>
          </el-form-item>
        </div>
        <div class="dynamic-container">
        <el-form-item label="内金案内" prop="depositAnnouncement">
          <elx-select v-model="detailRow.proContractInfo.depositAnnouncement" 
          selectKey="SCM_DEPOSIT_INFORMATION" 
          class="width-zoom-1"
          :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="内金請求書" prop="depositInvoice">
          <elx-select v-model="detailRow.proContractInfo.depositInvoice" 
          selectKey="SCM_INVOICE_TYPE" 
          class="width-zoom-1"
          :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="内金金額" prop="depositAmount">
          <div class="input-with-suffix">
            <el-input 
              v-model.number="detailRow.proContractInfo.depositAmount"
              class="width-zoom-1"
              :formatter="formatMoney"
              :parser="parseMoney"
              :disabled="isReadOnly"
              prop="depositAmount"/>
          </div>
        </el-form-item>
        <el-form-item label="内金入金日" prop="depositPaymentDate">
          <el-date-picker
            v-model="detailRow.proContractInfo.depositPaymentDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container">
          <el-form-item label="完了予定日" prop="estimatedCompletionDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.estimatedCompletionDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="実績完了日" prop="actualCompletionDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.actualCompletionDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="請求書送付日" prop="invoiceShipmentDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.invoiceShipmentDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="入金予定日" prop="expectedPaymentDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.expectedPaymentDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="dynamic-container">
          <el-form-item label="入金日" prop="paymentDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.paymentDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="領収書送付日" prop="receiptShipmentDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.receiptShipmentDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="お客様アンケート送付日" prop="customerSurveyShipmentDate">
            <el-date-picker
            v-model="detailRow.proSupportContent.customerSurveyShipmentDate"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="お客様アンケート返送有無" prop="customerSurveyReturned">
            <elx-select v-model="detailRow.proSupportContent.customerSurveyReturned" 
            selectKey="SCM_CUSTOMER_SURVEY_RETURN_STATUS" 
            class="width-zoom-1"
            :disabled="isReadOnly">
            </elx-select>
          </el-form-item>
        </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">サポート詳細</span></span></template>
      <div class="dynamic-container-top dynamic-container" style="margin-bottom: 10px;">
        <el-form-item label="サポート売上">
          <!-- :tableDataVal="tableDataSupport" -->
          <TableAddDocSupport :tableColumns="addDocTableColumnsSupport"
                              :tableUrl="tableUrlAddDoc"
                              :bizDataNo="detailRow.proContractorInfo.id"
                              bizDataType="0"
                              :isReadOnly="isReadOnly"
                              :key="$forceReload()"
                              ref="tableComtRefAddDocSupport"/>
          </el-form-item>
      </div>
      <!-- <el-divider></el-divider>
      <div class="dynamic-container" style="margin-bottom: 30px;">
        <el-form-item label="サポート売上（実績）">
          <TableAddDocSupportJissai :tableColumns="addDocTableColumnsSupportJissai"
                              :tableUrl="tableUrlAddDoc"
                              ref="tableComtRefAddDocSupportJissai"
                              :hideOperations="true"
                              :bizDataNo="detailRow.proContractorInfo.id"
                              bizDataType="1"
                              :isReadOnly="isReadOnly"
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
          <!-- :tableDataVal="[{expenseType: '1'},{expenseType: '2'},{expenseType: '3'}]" -->
          <div class="width-zoom-5">
            <TableAddProject
              :tableColumns="addDocTableColumnsProject"
              :tableUrl="tableUrlAddDocExpenses"
              ref="tableComtRefAddDocProject"
              :isReadOnly="isReadOnly"
              :bizDataNo="detailRow.proContractorInfo.id"
              :key="$forceReload()"
            />
          </div>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件支出合計" prop="ankenExpensesTotal">
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
              <el-input v-model="detailRow.proContractorInfo.totalCaseProfit" :disabled="true" class="width-zoom-1"></el-input>
            </div>
        </el-form-item>
        <el-form-item label="案件粗利率" prop="grossMarginRate">
            <div class="input-with-suffix">
              <el-input v-model="detailRow.proContractorInfo.grossMarginRate" :disabled="true" class="width-zoom-1"></el-input>
              <span class="suffix-text"  style="padding: 0px 0px 0px 5px;">%</span>
            </div>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header"><span style="font-weight: bold; font-size: 1.2em;">進捗管理</span></span></template>
      <div class="width-history-2">
        <el-form-item label="進捗状況">
          <!-- :tableDataVal="tableDataHistory" -->
          <TableAddDoc 
            :tableColumns="addDocTableColumns"
            :isReadOnly="isReadOnly"
            :bizDataNo="detailRow.proContractorInfo.id"
            bizDataType="pro"
            ref="tableComtRefAddDoc"
            :key="$forceReload()"
          />
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="次回アクション" prop="nextAction">
          <el-input v-model="detailRow.proContractorInfo.nextAction" 
          maxlength="32" 
          class="width-zoom-2"
          :disabled="isReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="日付" prop="date">
          <el-date-picker
            v-model="detailRow.proContractorInfo.date"
            type="date" style="width: var(--width-zoom-1);"
            :disabled="isReadOnly">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="時刻" prop="time" class="width-zoom-1">
          <el-time-picker
            v-model="detailRow.proContractorInfo.time"
            :disabled="isReadOnly">
          </el-time-picker>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">営業活動報告書</span></div>
      <div class="dynamic-container">
          <el-form-item label="報告書作成" prop="reportCreation">
            <elx-radio-group v-model="detailRow.proContractorInfo.reportCreation" 
            selectKey="SCM_REPORT_CREATION_STATUS" 
            groupName="gtpName" 
            :disabled="isReadOnly"></elx-radio-group>
          </el-form-item>
          <el-form-item label="有の場合、作成開始月" prop="ifApplicableCreationStartMonth">
            <el-input v-model="detailRow.proContractorInfo.ifApplicableCreationStartMonth" 
            :disabled="isReadOnly || !detailRow.proContractorInfo.reportCreation?.includes('2')" 
            class="width-zoom-1"></el-input>
          </el-form-item>
        </div>
        <div class="width-report-1">
          <!-- :tableDataVal="tableDataReport" -->
          <TableAddDocReport :tableColumns="addDocTableColumnsReport"
                           :tableUrl="tableUrlAddDocReport"
                           :isReadOnly="isReadOnly"
                           :bizDataNo="detailRow.proContractorInfo.id"
                           ref="tableComtRefAddDocReport"
                           :key="$forceReload()"
                           />
        </div><p/>
    </el-card>
    <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">一時的ボタンエリア</span></template>
      <div class="dynamic-container" >
        <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存</el-button>
      </div>
    </el-card> -->
    <div class="detail-btn-group-cls">
         <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
    </div>
    <!-- 跳转POT数据选择 -->
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
import potPotentialList from '@/pages/pot/potPotentialList.vue'
import sysUserList from '@/pages/sys/sysUserList.vue'
import {defineProps, defineEmits, reactive, ref, onMounted, watch} from 'vue';
// import axios from 'axios' // 引入 axios
import {useFetch} from '#app'
import {ElMessage, ElMessageBox} from 'element-plus'
import type { ComponentSize, FormProps } from 'element-plus'
import '~/assets/css/app.css';
import { Search } from '@element-plus/icons-vue'
const tableDataSupport = ref<[]>([]);
const tableDataReport = ref<[]>([]);
const tableDataHistory = ref<[]>([]);
const depositAmount = ref('')
const consultingRevenue = ref('')
const consultantItakuryo = ref<number | string>('');
const akiconShokairyo = ref<number | string>('');
const tableComtRefAddDocSupportJissai = ref<any>(null);
const supportTotalSales = ref('0');
const consultSupportTotalSales = ref('0');
const supportTotalSalesDoing = ref('0');
const consultSupportTotalSalesDoing = ref('0');

const tableUrlAddDocReport = ref("/pot/activity/report/list");
const tableUrlAddDoc = ref("/pro/support/details/list");
const tableUrlAddDocExpenses = ref("/pro/case/expenses/list");
const labelPosition = ref<FormProps['labelPosition']>('top');
const loadingSave = ref(false);
const updRowRef = ref();
const {$api} = useNuxtApp()
const damiAddress = ref('');
const tableComtRefAddDoc = ref(null);
const tableComtRefAddDocSupport = ref(null);
const tableComtRefAddDocReport = ref(null);
const tableComtRefAddDocProject = ref(null);
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

const parseNumber = (value: string) => {
  return value.replace(/,/g, '');
};

// const formatTelNumber = () => {
//   const numbers = props.detailRow.proContractorInfo.tel.replace(/[^0-9]/g, '');
//   if (numbers.length === 10) {
//     props.detailRow.proContractorInfo.tel = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
//   } else if (numbers.length === 11) {
//     props.detailRow.proContractorInfo.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
//   }
// };

const formatTelNumber = () => {
  return;
  const numbers = props.detailRow.proContractorInfo.tel.replace(/[^0-9]/g, '');

  if (numbers.length === 11) {
    // 手机格式，如 090-1234-5678
    props.detailRow.proContractorInfo.tel = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 10) {
    if (numbers.startsWith('03') || numbers.startsWith('06')) {
      // 东京都区部、大阪，格式如 03-1234-5678
      props.detailRow.proContractorInfo.tel = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('011') || numbers.startsWith('045') || numbers.startsWith('092')) {
      // 北海道、横滨、福冈等地，格式如 011-123-4567
      props.detailRow.proContractorInfo.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    } else {
      // 默认 fallback：3-3-4（不准确但安全）
      props.detailRow.proContractorInfo.tel = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
  }
};

const formatMobileNumber = () => {
  return;
  if (!props.detailRow.proContractorInfo.mobileNumber) return;
  
  // 数字のみを抽出
  const numbers = props.detailRow.proContractorInfo.mobileNumber.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    props.detailRow.proContractorInfo.mobileNumber = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
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
  { prop: 'billingAddress', label: '請求先' , inTyp: 'select', selectUrl: "/biz/partner/info/list", keyName: "id", labelName: "companyName"},
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

const props = defineProps({
  editUrl: String,
  isReadOnly: Boolean,
  detailRow: {
    type: Object,
    required: true,
  }
});

onMounted(() => {
  // 初期表示時のフォーマット処理
  if (props.detailRow.proContractorInfo.mobileNumber) {
    formatMobileNumber();
  }
  if (props.detailRow.proContractorInfo.tel) {
    formatTelNumber();
  }
  if (props.detailRow.proContractorInfo.residencePostalCode) {
    formatPostalCode();
  }
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
  const totalSales = Number(consultSupportTotalSalesDoing.value || 0);
  const totalExpenses = Number(ankenShishutsuGokei.value || 0);
  props.detailRow.proContractorInfo.totalCaseProfit = String(totalSales - totalExpenses);
  
  // 案件粗利率の計算（売上がある場合のみ）
  if (totalSales > 0) {
    // 案件粗利率 = 案件収支合計 / コンサルサポート合計売上
    const profitRate = (Number(props.detailRow.proContractorInfo.totalCaseProfit) / totalSales) * 100;
    props.detailRow.proContractorInfo.grossMarginRate = profitRate.toFixed(1);
  } else {
    props.detailRow.proContractorInfo.grossMarginRate = "0";
  }
};

// コンサルサポート合計売上と案件支出合計の変更を監視して案件収支合計を計算
watch([consultSupportTotalSalesDoing, ankenShishutsuGokei], calculateTotalCaseProfit, { deep: true });

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
watch(() => props.detailRow.proContractorInfo.consultingRevenue, (newVal) => {
  consultingRevenue.value = newVal;
});

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

const formatPostalCode = () => {
  if (!props.detailRow.proContractorInfo.residencePostalCode) return;
  const numbers = props.detailRow.proContractorInfo.residencePostalCode.replace(/[^0-9]/g, '');
  if (numbers.length === 7) {
    props.detailRow.proContractorInfo.residencePostalCode = numbers.slice(0, 3) + '-' + numbers.slice(3);
  }
};

const emit = defineEmits(['save', 'close']);

const save = async () => {
  loadingSave.value = true;
  // ここでバリデーションを実行
  const isValid = await validateForm(updRowRef.value);
  if (!isValid) {
    loadingSave.value = false;
    return;
  }
  try {
    loadingSave.value = true;
    const response = await useNuxtApp().$api(props.editUrl, {
      method: 'PUT',
      headers: { "Content-Type": "application/json" },
      body: {
        proContractorInfo: props.detailRow.proContractorInfo,
        proContractInfo: props.detailRow.proContractInfo,
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
  'proContractorInfo.residencePostalCode': [{
    required: false,
    pattern: /^\d{3}-\d{4}$/,
    message: '正しい郵便番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'proContractorInfo.tel': [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しいTELの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'proContractorInfo.mobileNumber': [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しい携帯番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'proContractorInfo.emailAddress': [{
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
  //debugger
  // props.detailRow.potId = lineData.potPotentialMaster.id; // 修正：移除 .value
  //意向顧客のID
  props.detailRow.proContractorInfo.potId = lineData.potPotentialMaster.id; // 修正：移除 .value
  //顧客ID
  props.detailRow.proContractorInfo.customerId = lineData.potCustomerInfo.customerId;
  //案件流入経路
  props.detailRow.proContractorInfo.caseSource = lineData.potPotentialMaster.potSource;
  //案件流入詳細
  props.detailRow.proContractorInfo.caseDetails = lineData.potPotentialMaster.potDetails;
  //相談者名
  props.detailRow.proContractorInfo.consultantName = lineData.potCustomerInfo.consultantName;
  //フリガナ
  props.detailRow.proContractorInfo.furigana = lineData.potCustomerInfo.furigana;
  //TEL
  props.detailRow.proContractorInfo.tel = lineData.potCustomerInfo.phoneNumber;
  //携帯番号
  props.detailRow.proContractorInfo.mobileNumber = lineData.potCustomerInfo.mobileNumber;
  //メールアドレス
  props.detailRow.proContractorInfo.emailAddress = lineData.potCustomerInfo.emailAddress;
  //居住地域 郵便番号
  props.detailRow.proContractorInfo.residencePostalCode = lineData.potCustomerInfo.residencePostalCode;
  //居住地域
  props.detailRow.proContractorInfo.residenceArea = lineData.potCustomerInfo.currentResidence;
  //居住地 住所（書面郵送先）
  props.detailRow.proContractorInfo.residenceAddress = lineData.potCustomerInfo.residenceAddress;
  //書面郵送宛名
  props.detailRow.proContractInfo.postalAddress = lineData.potCustomerInfo.postalAddress;
  //土地謄本 所有者名
  props.detailRow.proContractInfo.landRegistryOwnerName = lineData.potRealEstateSummary.landRegistryOwnerName;
  //土地謄本 地番
  props.detailRow.proContractInfo.landRegistryLotNumber = lineData.potRealEstateSummary.landRegistryLotNumber;
  selectDialogVisible.value = false;
};
const selectUserWorkerDialogVisible = ref(false)
const openSelectUserWorkerDialog = () => { 
  selectUserWorkerDialogVisible.value = true;
}
const handleSelectUser = (userData: any) => {
  props.detailRow.proContractorInfo.caseHandler = userData.fullName
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
