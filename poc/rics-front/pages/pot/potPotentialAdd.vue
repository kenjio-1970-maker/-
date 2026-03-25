<template>
  <el-form
    label-width="80px"
    :rules="rules"
    :model="formModel"
    :inline="true"
    :label-position="labelPosition"
    ref="addRowRef">
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">基本情報</span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="案件ID" prop="id">
          <el-input
            v-model="formModel.addCustomerInfoRow.id"
            class="width-zoom-2"
            :disabled=true
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="対応状況" prop="handlingStatus">
          <elx-select v-model="formModel.addRow.handlingStatus" selectKey="SCM_POTENTIAL_RESP_STATUS" class="width-zoom-2"></elx-select>
        </el-form-item>
        <el-form-item label="受付日" prop="receptionDate">
          <el-date-picker
            v-model="formModel.addRow.receptionDate"
            style="width: var(--width-zoom);"
            type="datetime">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="案件流入経路" prop="potSource">
          <elx-select v-model="formModel.addRow.potSource" 
                      class="width-zoom-2"
                      selectUrl="/apl/qryAplInquirySource"
                      keyName ="code" 
                      labelName ="source"
                      >
          </elx-select>
        </el-form-item>
        <el-form-item label="案件流入詳細" prop="potDetails">
          <el-input
            v-model="formModel.addRow.potDetails"
            class="width-zoom-1"
            maxlength="255">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件担当者ワーカー" prop="potManagerWorker">
          <el-input
            v-model="formModel.addRow.potManagerWorker"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectUserWorkerDialog" />
          </template>
          </el-input>
        </el-form-item>
        <el-form-item label="案件担当者CT" prop="potManagerCt">
          <el-input
            v-model="formModel.addRow.potManagerCt"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectUserCtDialog"/>
          </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="問合せID" prop="inquiryId">
          <el-input
            v-model="formModel.addRow.inquiryId"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectDialog"/>
          </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件ランク" prop="potRank">
          <elx-select v-model="formModel.addRow.potRank" selectKey="SCM_INTERVIEW_RANK" class="width-zoom-1"></elx-select>
        </el-form-item>
        <el-form-item label="確度" prop="certainty">
          <div class="input-with-suffix">
            <el-input
              v-model="formModel.addRow.certainty"
              class="width-zoom-1"
              maxlength="50">
            </el-input>
            <span class="suffix-text">%</span>
          </div>
        </el-form-item>
      </div>
    </el-card>
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">相談者情報 - 現在の居住地・書面発送先など</span></template>
      <div class="dynamic-container-top dynamic-container">
        <!--<el-form-item label="見込み顧客ID" prop="customerId">
          <el-input
            v-model="formModel.addCustomerInfoRow.customerId"
            class="width-zoom-1"
            :disabled=true
            maxlength="36">
          </el-input>
        </el-form-item>-->
        <el-form-item label="相談者名" prop="consultantName">
          <el-input
            v-model="formModel.addCustomerInfoRow.consultantName"
            class="width-zoom-1"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="フリガナ" prop="furigana">
          <el-input
            v-model="formModel.addCustomerInfoRow.furigana"
            class="width-zoom-1"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="TEL" prop="addCustomerInfoRow.phoneNumber">
          <el-input
            v-model="formModel.addCustomerInfoRow.phoneNumber"
            class="width-zoom-1"
            @blur="formatTelNumber"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="携帯番号" prop="addCustomerInfoRow.mobileNumber">
          <el-input
            v-model="formModel.addCustomerInfoRow.mobileNumber"
            class="width-zoom-1"
            @blur="formatMobileNumber"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="メールアドレス" prop="addCustomerInfoRow.emailAddress">
          <el-input
            v-model="formModel.addCustomerInfoRow.emailAddress"
            class="width-zoom-2"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="見解書送付希望メールアドレス" prop="addCustomerInfoRow.reportSendingEmail">
          <el-input
            v-model="formModel.addCustomerInfoRow.reportSendingEmail"
            class="width-zoom-2"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="現在の居住地" prop="currentResidence">
          <el-input
            v-model="formModel.addCustomerInfoRow.currentResidence"
            class="width-zoom-1"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="居住地" prop="addCustomerInfoRow.residence">
          <elx-radio-group
            v-model="formModel.addCustomerInfoRow.residence"
            selectKey="SCM_RESIDENCE"
            groupName="gtpName2" >
          </elx-radio-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="居住地 郵便番号" prop="addCustomerInfoRow.residencePostalCode">
          <el-input
            v-model="formModel.addCustomerInfoRow.residencePostalCode"
            class="width-zoom-1"
            @blur="formatPostalCode"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="居住地 住所（書面郵送先）" prop="residenceAddress">
          <el-input
            v-model="formModel.addCustomerInfoRow.residenceAddress"
            class="width-zoom-2"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="書面郵送宛名" prop="postalAddress">
          <el-input
            v-model="formModel.addCustomerInfoRow.postalAddress"
            class="width-zoom-1"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
    </el-card>
    <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">不動産概要</span></template>
      <div style="width: 100%; margin-bottom: 8px; margin-top: 8px;"><span style="font-weight: bold;">＜土地＞</span></div>
      <div class="dynamic-container">
        <el-form-item label="Q11 不動産の名義人氏名 ＊" prop="Q11">
          <el-input
            v-model="Q11"
            class="width-zoom-2"
            :disabled="true"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="Q12 名義人と相談者の関係 ＊" prop="Q12">
          <el-input
            v-model="Q12"
            class="width-zoom-2"
            :disabled="true"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q13 所有地の郵便番号＊" prop="Q13">
          <el-input
            v-model="Q13"
            class="width-zoom-1"
            :disabled="true"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="Q13 所有地の住居表示＊" prop="Q1301">
          <el-input
            v-model="Q1301"
            class="width-zoom-2"
            :disabled="true"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="Q14 所有地の地番 ＊" prop="Q14">
          <el-input
            v-model="Q14"
            class="width-zoom-1"
            :disabled="true"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="Q15 土地と建物の名義人が異なる ＊" prop="Q15">
          <elx-select v-model="Q15"
                      :disabled="true"
                      class="width-zoom-2"
                      selectKey="EQ_LAND_BUILDING_OWNER">
          </elx-select>
        </el-form-item>
        <el-form-item label="「はい」を選択した場合、説明をご記入ください。＊" prop="Q1501">
          <el-input
            v-model="Q1501"
            class="width-zoom-2"
            :disabled="true"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="土地謄本 所有者名" prop="landRegistryOwnerName">
          <el-input
            v-model="formModel.addEtateSummaryRow.landRegistryOwnerName"
            class="width-zoom-1"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="土地謄本　地番" prop="landRegistryLotNumber">
          <el-input
            v-model="formModel.addEtateSummaryRow.landRegistryLotNumber"
            class="width-zoom-2"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="地目" prop="landUse">
          <elx-select
            v-model="formModel.addEtateSummaryRow.landUse"
            class="width-zoom-1"
            selectKey="SCM_LAND_CATEGORY"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="用途地域" prop="zoning">
          <elx-select
            v-model="formModel.addEtateSummaryRow.zoning"
            class="width-zoom-1"
            selectKey="SCM_ZONING_DISTRICT"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="利用状況" prop="landUsageStatus">
          <elx-select
            v-model="formModel.addEtateSummaryRow.landUsageStatus"
            class="width-zoom-1"
            selectKey="SCM_USAGE_STATUS"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="土地面積" prop="landArea">
          <div class="input-with-suffix">
            <el-input
              v-model="formModel.addEtateSummaryRow.landArea"
              class="width-zoom-1"
              maxlength="50"
              :formatter="formatNumber"
              :parser="parseNumber">
            </el-input>
            <span class="suffix-text">㎡</span>
          </div>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container">
        <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">＜建物＞</span></div>
        <el-form-item label="家屋番号（半角数字）" prop="houseNumber">
          <el-input
            v-model="formModel.addEtateSummaryRow.houseNumber"
            class="width-zoom-1"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="建物謄本 所有者名" prop="buildingRegistryOwnerName ">
          <el-input
            v-model="formModel.addEtateSummaryRow.buildingRegistryOwnerName"
            class="width-zoom-1"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="築年数" prop="buildingAge">
          <elx-select
            v-model="formModel.addEtateSummaryRow.buildingAge"
            class="width-zoom-1"
            selectKey="SCM_BUILDING_AGE"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="延床面積" prop="totalFloorArea">
          <div class="input-with-suffix">
            <el-input
              v-model.N="formModel.addEtateSummaryRow.totalFloorArea"
              maxlength="50"
              class="width-zoom-1"
              :formatter="formatNumber"
              :parser="parseNumber">
            </el-input>
            <span class="suffix-text">㎡</span>
          </div>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="構造" prop="buildingStructure">
          <el-input
            v-model="formModel.addEtateSummaryRow.buildingStructure"
            class="width-zoom-2"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="階数" prop="numberOfFloors">
          <elx-select
            v-model="formModel.addEtateSummaryRow.numberOfFloors"
            class="width-zoom-1"
            selectKey="SCM_FLOOR_COUNT"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="地下の有無" prop="isBasement">
          <el-checkbox value="formModel.addRow.isBasement" name="type">
            地下あり
          </el-checkbox>
         
        </el-form-item>
      </div>
    </el-card> -->
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">社内進捗管理</span></template>
      <div class="width-history-2">
        <el-form-item label="進捗状況">
        <!--:tableUrl="tableUrlAddDoc"-->
          <TableAddDoc
            :tableColumns="addDocTableColumns"
            ref="tableComtRefAddDoc"
          />
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container">
        <el-form-item label="次回アクション" prop="nextAction" class="next-action-form-item">
          <el-input
            v-model="formModel.addRow.nextAction"
            class="width-zoom-1"
            maxlength="255"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="次回約束日" prop="nextPromiseDate" class="next-action-form-item">
          <el-date-picker
            v-model="formModel.addRow.nextPromiseDate"
            style="width: var(--width-zoom-1);"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="時刻" prop="nextPromiseTime" class="next-action-form-item" >
          <el-time-select
            v-model="formModel.addRow.nextPromiseTime"
            class="width-zoom-1"
            placeholder=""
          >
          </el-time-select>
        </el-form-item>
      </div>
      <!-- <div class="dynamic-container">
        <el-form-item label="見解書作成日" prop="reportCreationDate">
          <el-date-picker
            v-model="formModel.addRow.reportCreationDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="見解書送付日" prop="reportSendingDate">
          <el-date-picker
            v-model="formModel.addRow.reportSendingDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="S/Aランク連絡日" prop="saRankNotificationDate">
          <el-date-picker
            v-model="formModel.addRow.saRankNotificationDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="面談アポイント日" prop="interviewAppointmentDate">
          <el-date-picker
            v-model="formModel.addRow.interviewAppointmentDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="相談実施日" prop="consultationDate">
          <el-date-picker
            v-model="formModel.addRow.consultationDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="面談ランク" prop="interviewRank">
          <elx-select
            v-model="formModel.addRow.interviewRank"
            selectKey="SCM_INTERVIEW_RANK"
            class="width-zoom-1"
          >
          </elx-select>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="コンサル契約" prop="addRow.consultingContract">
          <elx-radio-group
            v-model="formModel.addRow.consultingContract"
            selectKey="SCM_CONSULTING_STAGE"
            groupName="gtpName2"
          >
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="コンサル契約書" prop="consultingContractDoc">
          <elx-select
            v-model="formModel.addRow.consultingContractDoc"
            selectKey="SCM_CONSULTANCY_AGREEMENT_STAGE"
            class="width-zoom-1"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="契約書発送日" prop="contractSendingDate">
          <el-date-picker
            v-model="formModel.addRow.contractSendingDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="契約書発送ワーカー" prop="contractSendingWorker">
          <el-input
            v-model="formModel.addRow.contractSendingWorker"
            class="width-zoom-1"
            maxlength="100"
          >
          </el-input>
        </el-form-item>
      </div> -->
      <div class="dynamic-container">
        <el-form-item label="作成日" prop="creationDate">
          <el-date-picker
            v-model="formModel.addRow.creationDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作成対応ワーカー" prop="creationWorker">
          <!-- <el-input
            v-model="formModel.addRow.creationWorker"
            class="width-zoom-1"
            maxlength="100"
          > </el-input>-->
          <!--  groupName="gtpName" -->
          <elx-select v-model="formModel.addRow.creationWorker" class="width-zoom-1" selectUrl="/sys/user/qryByUserType/3,4"  keyName = "id" labelName = "fullName"></elx-select>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container" style="margin-bottom: 0px;">
        <el-form-item label="実費見積 - 詳細">
        <!-- :tableUrl="tableUrlAddDoc" -->
          <TableAddDocCost :tableColumns="addDocTableTransport"
                           :tableDataVal="tableDataTransport"
                           ref="tableComtRefAddTransport"/>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 25px;">
        <el-button>実費見積書作成</el-button>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container" style="margin-bottom: 0px;">
        <el-form-item label="実費請求 - 詳細">
        <!-- :tableUrl="tableUrlAddDoc" -->
          <TableAddDocCost :tableColumns="addDocTableColumnsCost"
                           :tableDataVal="tableDataCost"
                           ref="tableComtRefAddDocCost"/>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 25px;">
        <el-button>請求書作成</el-button>
      </div>
      <div class="dynamic-container" >
      <el-form-item label="失注理由" prop="lostReason">
      <el-input
        v-model="formModel.addRow.lostReason"
        maxlength="255" class="width-zoom-2">
      </el-input>
    </el-form-item>
    <el-form-item label="失注顧客アンケート送付日" prop="lostCustomerSurveyDate">
      <el-date-picker
      v-model="formModel.addRow.lostCustomerSurveyDate"
      type="date" style="width: var(--width-zoom-1);">
    </el-date-picker>
    </el-form-item>  
  </div>
    </el-card>
    <el-card class="el-crd-cls" >
      <template #header><span class="card-header">ニーズ情報</span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="片付け" prop="addNeedsInfoRow.cleaningNeeds">
          <elx-radio-group 
            v-model="formModel.addNeedsInfoRow.cleaningNeeds" 
            selectKey="SCM_NEEDS" 
            groupName="gtpName2" >
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="火災" prop="addNeedsInfoRow.fireDamageNeeds">
          <elx-radio-group 
            v-model="formModel.addNeedsInfoRow.fireDamageNeeds" 
            selectKey="SCM_NEEDS" 
            groupName="gtpName2" >
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="損保保険会社" prop="insuranceCompany">
          <el-input
            v-model="formModel.addNeedsInfoRow.insuranceCompany"
            maxlength="100" class="width-zoom-1">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container" >
        <el-form-item label="管理" prop="addNeedsInfoRow.managementNeeds">
          <elx-radio-group 
            v-model="formModel.addNeedsInfoRow.managementNeeds" 
            selectKey="SCM_NEEDS" 
            groupName="gtpName2" >
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="仏壇お墓" prop="addNeedsInfoRow.buddhistAltarGraveNeeds">
          <elx-radio-group 
            v-model="formModel.addNeedsInfoRow.buddhistAltarGraveNeeds" 
            selectKey="SCM_NEEDS" 
            groupName="gtpName2" >
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="相続登記" prop="inheritanceRegistration">
          <elx-select
            v-model="formModel.addNeedsInfoRow.inheritanceRegistration"
            selectKey="SCM_INHERITANCE_REGISTRATION"
            class="width-zoom-1">
          </elx-select>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="width-history-1">
        <el-form-item label="出口戦略">
        <!-- :tableUrl="tableUrlAddDoc" -->
          <TableAddExport :tableColumns="addDocTableColumnsExport"
                           :tableDataVal="tableDataExport"
                           ref="tableComtRefAddExport"/>
        </el-form-item>
      </div>
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
    <el-dialog v-model="selectDialogVisible" title="問合せIDを選択してください" width="60%" heigth="80%">
      <aplInquiryMgntListSelect  @select-element="handleSelectElement" :isshowBtn="false" :fromPotential="true" ref="aplInquiryMgntRef"/>
    </el-dialog>
    <el-dialog v-model="selectUserWorkerDialogVisible" title="案件担当者ワーカーを選択してください" width="60%" heigth="80%">
      <sysUserList  @select-userWorker="handleSelectUserWorker" :isshowBtn="false" :fromPotential="true" :userKbn="3" ref="sysUserRef"/>
    </el-dialog>
    <el-dialog v-model="selectUserCtDialogVisible" title="案件担当者CTを選択してください" width="60%" heigth="80%">
      <sysUserList  @select-userCt="handleSelectUserCt" :isshowBtn="false" :fromPotential="true" :userKbn="1" ref="sysUserRef"/>
    </el-dialog>
  </el-form>
</template>

<script lang="ts" setup>
import {defineProps, defineEmits, reactive, ref} from 'vue';
// import axios from 'axios' // 引入 axios
import {useFetch} from '#app'
import {ElMessage, ElMessageBox} from 'element-plus'
import {onMounted} from "vue";
import type { ComponentSize, FormProps } from 'element-plus'
import TableAddDoc from '@/components/TableCommAddDoc.vue'
import TableAddDocCost from '@/components/TableCommAddDoc.vue'
import TableAddExport from '@/components/TableCommAddDoc.vue'
import aplInquiryMgntListSelect from '@/pages/apl/aplInquiryMgntList.vue'
import sysUserList from '@/pages/sys/sysUserList.vue'
import '~/assets/css/app.css';
import { validateForm } from '@/utils/formValidation';

// 对应履历模块  Ootoiawase
import otoiawaseComponentCost from '@/components/otoiawaseComponent.vue'
import { Search } from '@element-plus/icons-vue'
const tableUrlAddDocCost = ref("");
const lisOtoiawaseUrlCost = ref("");
const lisOtoiawaseRefCost = ref(null);
const tableDataCost = ref<[]>([]);
const tableDataTransport = ref<[]>([]);
const tableDataExport = ref<[]>([]);
const tableDataHistory = ref<[]>([]);
const tableUrlAddDoc = ref("");
const labelPosition = ref<FormProps['labelPosition']>('top');
/*init fields*/
const loadingSave = ref(false);
const addRowRef = ref();
const {$api} = useNuxtApp()
const damiAddress = ref('');
const tableComtRefAddExport = ref(null);
const tableComtRefAddDoc = ref(null);
const tableComtRefAddDocCost = ref(null);
const tableComtRefAddTransport = ref(null);
const potManagerWorker = ref('')
const potManagerCt = ref('')
const addDocTableColumns = [
{ prop: 'actionDate', label: '日付', inTyp: 'date', width: '160'},
{ prop: 'actionContent', label: '内容', inTyp: 'textarea', width: '700'},
]

/* const potInquiryIdCtSearch = () => {
    console.log('搜索内容:', inquiryId)
} */

const addDocTableTransport = [
  { prop: 'transportMod', label: '交通手段' , inTyp: 'select', selectKey: 'TRANSPORTATION'},
  { prop: 'accomFlag', label: '宿泊有無' , inTyp: 'select', selectKey: 'SHU_KU_HA_KU'},
  { prop: 'estExp', label: '実費見積額' , inTyp: 'money'},
  { prop: 'estSendAt', label: '実費見積送付日' , inTyp: 'date'},
  { prop: 'remark', label: '実費見積 - 備考' , inTyp: 'textarea'},
  { prop: 'worker', label: '対応ワーカー' , inTyp: 'select', selectUrl: '/sys/user/qryByUserType/3,4', keyName: 'id', labelName: 'fullName', width: '160'},

]

const addDocTableColumnsCost = [
  { prop: 'actualCostInvoice', label: '実費請求額' , inTyp: 'money'},
  { prop: 'invoiceSendDate', label: '実費請求発送日' , inTyp: 'date'},
  { prop: 'sendMod', label: '請求書 送付方法' , inTyp: 'select', selectKey: 'INVOICE_DELIVERY_METHOD'},
  { prop: 'remarks', label: '実費請求 - 備考' , inTyp: 'textarea'},
  { prop: 'worker', label: '対応ワーカー' , inTyp: 'select', selectUrl: '/sys/user/qryByUserType/3,4', keyName: 'id', labelName: 'fullName', width: '160'},
  { prop: 'invoiceSendDate', label: '実費 - 入金日' , inTyp: 'date'},
]

const addDocTableColumnsExport = [
  { prop: 'utilizationMethod', label: '活用方法', width: '160', inTyp: 'select', selectKey: 'SCM_APPLICATION_METHOD'},
  { prop: 'supplement', label: '補足' , inTyp: 'textarea', width: '700'},
]
const submitRuleFormAddDocCost = async () => {
  const tableData = tableComtRefAddDocCost.value.getTableData();
  console.log('表データCost:', tableData);
}

const formModel = reactive({
  addRow: {
    id: "",
  inquiryId: "",
  handlingStatus: "",
  receptionDate: "",
  potSource: "",
  potDetails: "",
  potRank: "",
  certainty: "",
  potManagerWorker: "",
  potManagerCt: "",
  nextAction: "",
  nextPromiseDate: "",
  nextPromiseTime: "",
  reportCreationDate: "",
  reportSendingDate: "",
  saRankNotificationDate: "",
  interviewAppointmentDate: "",
  consultationDate: "",
  interviewRank: "",
  consultingContract: "",
  consultingContractDoc: "",
  contractSendingDate: "",
  contractSendingWorker: "",
  lostReason: "",
  lostCustomerSurveyDate: "",
  customerId: "",
  //作成日
  creationDate: "",
  //作成対応ワーカー
  creationWorker: "",
  },
  addEtateSummaryRow: {
    id: "",
  potId: "",
  landRegistryOwnerName: "",
  landRegistryLotNumber: "",
  landUse: "",
  zoning: "",
  landArea: "",
  landUsageStatus: "",
  houseNumber: "",
  buildingRegistryOwnerName: "",
  buildingAge: "",
  totalFloorArea: "",
  buildingStructure: "",
  numberOfFloors: "",
  isBasement: "",
  },
  addNeedsInfoRow: {
    id: "",
  potId: "",
  cleaningNeeds: "",
  fireDamageNeeds: "",
  insuranceCompany: "",
  managementNeeds: "",
  buddhistAltarGraveNeeds: "",
  inheritanceRegistration: "",
  },
  addCustomerInfoRow: {
    id: "",
  customerId: "",
  consultantName: "",
  furigana: "",
  phoneNumber: "",
  mobileNumber: "",
  emailAddress: "",
  reportSendingEmail: "",
  currentResidence: "",
  residence: "",
  residencePostalCode: "",
  residenceAddress: "",
  postalAddress: "",
  // itemId: "",
  },
});

// const addRow = reactive({
//   id: "",
//   inquiryId: "",
//   handlingStatus: "",
//   receptionDate: "",
//   potSource: "",
//   potDetails: "",
//   potRank: "",
//   certainty: "",
//   potManagerWorker: "",
//   potManagerCt: "",
//   nextAction: "",
//   nextPromiseDate: "",
//   nextPromiseTime: "",
//   reportCreationDate: "",
//   reportSendingDate: "",
//   saRankNotificationDate: "",
//   interviewAppointmentDate: "",
//   consultationDate: "",
//   interviewRank: "",
//   consultingContract: "",
//   consultingContractDoc: "",
//   contractSendingDate: "",
//   contractSendingWorker: "",
//   lostReason: "",
//   lostCustomerSurveyDate: "",
//   customerId: "",
// });

// const addEtateSummaryRow = reactive({
//   id: "",
//   potId: "",
//   landRegistryOwnerName: "",
//   landRegistryLotNumber: "",
//   landUse: "",
//   zoning: "",
//   landArea: "",
//   landUsageStatus: "",
//   houseNumber: "",
//   buildingRegistryOwnerName: "",
//   buildingAge: "",
//   totalFloorArea: "",
//   buildingStructure: "",
//   numberOfFloors: "",
//   isBasement: "",
// });

// const addNeedsInfoRow = reactive({
//   id: "",
//   potId: "",
//   cleaningNeeds: "",
//   fireDamageNeeds: "",
//   insuranceCompany: "",
//   managementNeeds: "",
//   buddhistAltarGraveNeeds: "",
//   inheritanceRegistration: "",
// });

// const addCustomerInfoRow = reactive({
//   id: "",
//   customerId: "",
//   consultantName: "",
//   furigana: "",
//   phoneNumber: "",
//   mobileNumber: "",
//   emailAddress: "",
//   reportSendingEmail: "",
//   currentResidence: "",
//   residence: "",
//   residencePostalCode: "",
//   residenceAddress: "",
//   postalAddress: "",
// });
const formatNumber = (value: number) => {
  if (!value) return '0';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};


// const formatTelNumber = () => {
//   const numbers = formModel.addCustomerInfoRow.phoneNumber.replace(/[^0-9]/g, '');
//   if (numbers.length === 10) {
//     formModel.addCustomerInfoRow.phoneNumber = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
//   } else if (numbers.length === 11) {
//     formModel.addCustomerInfoRow.phoneNumber = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
//   }
// };

const formatTelNumber = () => {
  return;
  const numbers = formModel.addCustomerInfoRow.phoneNumber.replace(/[^0-9]/g, '');

  if (numbers.length === 11) {
    // 手机格式，如 090-1234-5678
    formModel.addCustomerInfoRow.phoneNumber= numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 10) {
    if (numbers.startsWith('03') || numbers.startsWith('06')) {
      // 东京都区部、大阪，格式如 03-1234-5678
      formModel.addCustomerInfoRow.phoneNumber= numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('011') || numbers.startsWith('045') || numbers.startsWith('092')) {
      // 北海道、横滨、福冈等地，格式如 011-123-4567
      formModel.addCustomerInfoRow.phoneNumber= numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    } else {
      // 默认 fallback：3-3-4（不准确但安全）
      formModel.addCustomerInfoRow.phoneNumber= numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
  }
};

const formatMobileNumber = () => {
  return;
  if (!formModel.addCustomerInfoRow.mobileNumber) return;
  
  // 数字のみを抽出
  const numbers = formModel.addCustomerInfoRow.mobileNumber.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    formModel.addCustomerInfoRow.mobileNumber = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
};
const formatPostalCode = () => {
  if (!formModel.addCustomerInfoRow.residencePostalCode) return;
  const numbers = formModel.addCustomerInfoRow.residencePostalCode.replace(/[^0-9]/g, '');
  if (numbers.length === 7) {
    formModel.addCustomerInfoRow.residencePostalCode = numbers.slice(0, 3) + '-' + numbers.slice(3);
  }
};
const parseNumber = (value: string) => {
  if (!value) return '';
  return value.replace(/(,*)/g, '');
};
onMounted(() => {
  // submitRuleFormAddDocDemo();
});
onBeforeMount(() => {
});

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
        potPotentialMaster: formModel.addRow,
        potRealEstateSummary: formModel.addEtateSummaryRow,
        potNeedsInfo: formModel.addNeedsInfoRow,
        potCustomerInfo: formModel.addCustomerInfoRow,
        bizProgressHistoryList: tableComtRefAddDoc.value.getTableData(),
        potSquareInvoiceSendDate: tableComtRefAddDocCost.value.getTableData(),
        potExportStrategy: tableComtRefAddExport.value.getTableData(),
        potSquareInvoiceTransportList: tableComtRefAddTransport.value.getTableData(),
      }
    })

    if (response.success) {
      emit('save', response);
      return;
    }
    ElMessage({type: 'error', message: response.msg, style: 'z-index: 3000;'});
  } catch (error) {
    ElMessage({type: 'error', message: 'Failed to retrieve data: ' + error, style: 'z-index: 3000;'});
  }finally {
    loadingSave.value = false;
  }
};

const rules = {
  'addCustomerInfoRow.residence': [{required: true, message: '居住地を選択してください', trigger: ['blur', 'change']}],
  'addRow.consultingContract': [{required: true, message: 'コンサル契約を入力してください', trigger: ['blur', 'change']},],
  'addNeedsInfoRow.cleaningNeeds': [{required: true, message: '選択してください', trigger: ['blur', 'change']},],
  'addNeedsInfoRow.fireDamageNeeds': [{required: true, message: '選択してください', trigger: ['blur', 'change']},],
  'addNeedsInfoRow.managementNeeds': [{required: true, message: '選択してください', trigger: ['blur', 'change']},],
  'addNeedsInfoRow.buddhistAltarGraveNeeds': [{required: true, message: '選択してください', trigger: ['blur', 'change']},],
  'addCustomerInfoRow.residencePostalCode': [{
    required: false,
    pattern: /^\d{3}-\d{4}$/,
    message: '正しい郵便番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'addCustomerInfoRow.phoneNumber': [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しいTELの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'addCustomerInfoRow.mobileNumber': [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しい携帯番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'addCustomerInfoRow.emailAddress': [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'addCustomerInfoRow.reportSendingEmail': [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
};
// 跳转用户选择
const selectDialogVisible = ref(false)
const openSelectDialog = () => { 
  selectDialogVisible.value = true;
}
// const Q11 = ref('');
// const Q12 = ref('');
// const Q13 = ref('');
// const Q1301 = ref('');
// const Q14 = ref('');
// const Q15 = ref('');
// const Q1501 = ref('');
const handleSelectElement = (lineData: any) => {
  //問合せID
  formModel.addRow.inquiryId = lineData.aplInquiryMgnt.id; // 修正：移除 .value
  //相談者名
  formModel.addCustomerInfoRow.consultantName = lineData.aplInquiryMgnt.customerName;
  //フリガナ
  formModel.addCustomerInfoRow.furigana = lineData.aplInquiryMgnt.nameFurigana;
  //メールアドレス
  formModel.addCustomerInfoRow.emailAddress = lineData.aplInquiryMgnt.loginEmail
  //見解書送付希望メールアドレス
  formModel.addCustomerInfoRow.reportSendingEmail = lineData.aplInquiryMgnt.contactEmail
  //電話番号
  formModel.addCustomerInfoRow.mobileNumber = lineData.aplInquiryMgnt.phoneNumber
  //現在の居住地
  formModel.addCustomerInfoRow.currentResidence = lineData.aplInquiryMgnt.currentRegion
  //書面郵送宛名
  formModel.addCustomerInfoRow.postalAddress = lineData.aplInquiryMgnt.reportRecipientName
  //流入経路
  formModel.addRow.potSource = lineData.aplInquiryMgnt.aplSource
  //ランク
  formModel.addRow.potRank = lineData.aplInquiryMgnt.aplRank

  // Q11.value = lineData.aplInquiryMaster.Q11;
  // Q12.value = lineData.aplInquiryMaster.Q12;
  // Q13.value = lineData.aplInquiryMaster.Q13;
  // Q1301.value = lineData.aplInquiryMaster.Q1301;
  // Q14.value = lineData.aplInquiryMaster.Q14;
  // Q15.value = lineData.aplInquiryMaster.Q15;
  // Q1501.value = lineData.aplInquiryMaster.Q1501;
  selectDialogVisible.value = false;
};

const selectUserWorkerDialogVisible = ref(false)
const openSelectUserWorkerDialog = () => { 
  selectUserWorkerDialogVisible.value = true;
  // 传递fromPotential参数，用于标识是从potPotentialAdd页面调用的
}
const handleSelectUserWorker = (userData: any) => {
  formModel.addRow.potManagerWorker = userData.fullName
  selectUserWorkerDialogVisible.value = false
}
const selectUserCtDialogVisible = ref(false)
const openSelectUserCtDialog = () => { 
  selectUserCtDialogVisible.value = true;
}
const handleSelectUserCt = (userData: any) => {
  formModel.addRow.potManagerCt = userData.fullName
  selectUserCtDialogVisible.value = false
}
</script>

<style scoped>
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
