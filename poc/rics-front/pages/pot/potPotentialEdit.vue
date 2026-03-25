<template>
  <el-form
    label-width="80px"
    :rules="rules"
    :model="detailRow"
    :inline="true"
    :label-position="labelPosition"
    ref="updRowRef">
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">基本情報</span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="案件ID" prop="tempId">
          <el-input
            v-model="detailRow.potPotentialMaster.tempId"
            class="width-zoom-2"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="対応状況" prop="handlingStatus">
          <elx-select v-model="detailRow.potPotentialMaster.handlingStatus" 
          selectKey="SCM_POTENTIAL_RESP_STATUS"
          class="width-zoom-2"
          :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="受付日" prop="receptionDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.receptionDate"
            style="width: var(--width-zoom);"
            type="datetime"
            :disabled="isReadOnly">
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="案件流入経路" prop="potSource">
          <elx-select v-model="detailRow.potPotentialMaster.potSource"
            class="width-zoom-2"
            selectUrl="/apl/qryAplInquirySource"
            keyName ="code" 
            labelName ="source"
            :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="案件流入詳細" prop="potDetails">
          <el-input
            v-model="detailRow.potPotentialMaster.potDetails"
            class="width-zoom-1"
            maxlength="255"
            :disabled="isReadOnly">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件担当者ワーカー" prop="potManagerWorker">
          <el-input
            v-model="detailRow.potPotentialMaster.potManagerWorker"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectUserWorkerDialog" :disabled="isReadOnly"/>
          </template>
          </el-input>
        </el-form-item>
        <el-form-item label="案件担当者CT" prop="potManagerCt">
          <el-input
            v-model="detailRow.potPotentialMaster.potManagerCt"
            class="width-zoom-2"
            :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectUserCtDialog" :disabled="isReadOnly"/>
          </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="問合せID" prop="inquiryId">
          <el-input
            v-model="detailRow.potPotentialMaster.inquiryId"
            class="width-zoom-2" :disabled="true">
          <template #append>
            <el-button class="search-icon" :icon="Search" @click="openSelectDialog" :disabled="isReadOnly"/>
          </template>
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="案件ランク" prop="potRank">
          <elx-select v-model="detailRow.potPotentialMaster.potRank" 
          selectKey="SCM_INTERVIEW_RANK" 
          class="width-zoom-1"
          :disabled="isReadOnly"
          ></elx-select>
        </el-form-item>
        <el-form-item label="確度" prop="certainty">
          <div class="input-with-suffix">
            <el-input
              v-model="detailRow.potPotentialMaster.certainty"
              class="width-zoom-1"
              :disabled="isReadOnly"
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
            v-model="detailRow.potCustomerInfo.customerId"
            class="width-zoom-1"
            :disabled=true
            maxlength="36">
          </el-input>
        </el-form-item>-->
        <el-form-item label="相談者名" prop="consultantName">
          <el-input
            v-model="detailRow.potCustomerInfo.consultantName"
            class="width-zoom-1"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="ひらがな" prop="furigana">
          <el-input
            v-model="detailRow.potCustomerInfo.furigana"
            class="width-zoom-1"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="TEL" prop="potCustomerInfo.phoneNumber">
          <el-input
            v-model="detailRow.potCustomerInfo.phoneNumber"
            class="width-zoom-1"
            @blur="formatTelNumber"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="携帯番号" prop="potCustomerInfo.mobileNumber">
          <el-input
            v-model="detailRow.potCustomerInfo.mobileNumber"
            class="width-zoom-1"
            @blur="formatMobileNumber"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="メールアドレス" prop="potCustomerInfo.emailAddress">
          <el-input
            v-model="detailRow.potCustomerInfo.emailAddress"
            class="width-zoom-2"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="見解書送付希望メールアドレス" prop="potCustomerInfo.reportSendingEmail">
          <el-input
            v-model="detailRow.potCustomerInfo.reportSendingEmail"
            class="width-zoom-2"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="現在の居住地" prop="currentResidence">
          <el-input
            v-model="detailRow.potCustomerInfo.currentResidence"
            class="width-zoom-1"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="居住地" prop="potCustomerInfo.residence">
          <elx-radio-group
            v-model="detailRow.potCustomerInfo.residence"
            selectKey="SCM_RESIDENCE"
            :disabled="isReadOnly"
            groupName="gtpName2" >
          </elx-radio-group>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="居住地 郵便番号" prop="potCustomerInfo.residencePostalCode">
          <el-input
            v-model="detailRow.potCustomerInfo.residencePostalCode"
            class="width-zoom-1"
            :disabled="isReadOnly"
            @blur="formatPostalCode"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="居住地 住所（書面郵送先）" prop="residenceAddress">
          <el-input
            v-model="detailRow.potCustomerInfo.residenceAddress"
            class="width-zoom-2"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
        <el-form-item label="書面郵送宛名" prop="postalAddress">
          <el-input
            v-model="detailRow.potCustomerInfo.postalAddress"
            class="width-zoom-1"
            :disabled="isReadOnly"
            maxlength="36">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="謄本情報ファイル" prop="postalAddress">
           <FileUpload
                    :disabled="isReadOnly"
                    :bizNo="detailRow.potPotentialMaster.id"
                    fileType="deedFileId"
                    :preview-url="'download'"
                    :limit="3"
                    :max-size-m-b="10"
                    :enableGlobalDrop="true"
                    :isPreview="true"  />
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
            v-model="detailRow.potRealEstateSummary.landRegistryOwnerName"
            class="width-zoom-1"
            maxlength="36"
            :disabled="isReadOnly">
          </el-input>
        </el-form-item>
        <el-form-item label="土地謄本 地番" prop="landRegistryLotNumber">
          <el-input
            v-model="detailRow.potRealEstateSummary.landRegistryLotNumber"
            class="width-zoom-2"
            maxlength="36"
            :disabled="isReadOnly">
          </el-input>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="地目" prop="landUse">
          <elx-select
            v-model="detailRow.potRealEstateSummary.landUse"
            class="width-zoom-1"
            :disabled="isReadOnly"
            selectKey="SCM_LAND_CATEGORY"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="用途地域" prop="zoning">
          <elx-select
            v-model="detailRow.potRealEstateSummary.zoning"
            class="width-zoom-1"
            selectKey="SCM_ZONING_DISTRICT"
            :disabled="isReadOnly"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="利用状況" prop="landUsageStatus">
          <elx-select
            v-model="detailRow.potRealEstateSummary.landUsageStatus"
            class="width-zoom-1"
            selectKey="SCM_USAGE_STATUS"
            :disabled="isReadOnly"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="土地面積" prop="landArea">
          <div class="input-with-suffix">
            <el-input
              v-model.number="detailRow.potRealEstateSummary.landArea"
              class="width-zoom-1"
              maxlength="50"
              :formatter="formatNumber"
              :parser="parseNumber"
              :disabled="isReadOnly">
            </el-input>
            <span class="suffix-text">㎡</span>
          </div>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div style="width: 100%; margin-bottom: 8px;"><span style="font-weight: bold;">＜建物＞</span></div>
      <div class="dynamic-container">
        <el-form-item label="家屋番号（半角数字）" prop="houseNumber">
          <el-input
            v-model="detailRow.potRealEstateSummary.houseNumber"
            class="width-zoom-1"
            maxlength="36"
            :disabled="isReadOnly">
          </el-input>
        </el-form-item>
        <el-form-item label="建物謄本 所有者名" prop="buildingRegistryOwnerName ">
          <el-input
            v-model="detailRow.potRealEstateSummary.buildingRegistryOwnerName"
            class="width-zoom-1"
            maxlength="36"
            :disabled="isReadOnly">
          </el-input>
        </el-form-item>
        <el-form-item label="築年数" prop="buildingAge">
          <elx-select
            v-model="detailRow.potRealEstateSummary.buildingAge"
            class="width-zoom-1"
            selectKey="SCM_BUILDING_AGE"
            :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="延床面積" prop="totalFloorArea">
          <div class="input-with-suffix">
            <el-input
              v-model.number="detailRow.potRealEstateSummary.totalFloorArea"
              class="width-zoom-1"
              maxlength="50"
              :disabled="isReadOnly"
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
            v-model="detailRow.potRealEstateSummary.buildingStructure"
            maxlength="36" class="width-zoom-2"
            :disabled="isReadOnly">
          </el-input>
        </el-form-item>
        <el-form-item label="階数" prop="numberOfFloors">
          <elx-select
            v-model="detailRow.potRealEstateSummary.numberOfFloors"
            class="width-zoom-1"
            selectKey="SCM_FLOOR_COUNT"
            :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
        <el-form-item label="地下の有無" prop="isBasement">
          <el-checkbox v-model="detailRow.potRealEstateSummary.isBasement" name="type" :disabled="isReadOnly">
            地下あり
          </el-checkbox>
        </el-form-item>
      </div>
    </el-card> -->
    <el-card class="el-crd-cls">
      <template #header><span class="card-header">社内進捗管理</span></template>
      <div class="width-history-2">
        <el-form-item label="進捗状況">
          <!-- :tableDataVal="tableDataHistory" -->
          <TableAddDoc 
            :tableColumns="addDocTableColumns"
            bizDataType="pot"
            :bizDataNo="detailRow.potPotentialMaster.id"
            :isReadOnly="isReadOnly"
            :key="$forceReload()"
            ref="tableComtRefAddDoc"
          />
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container">
        <el-form-item label="次回アクション" prop="nextAction" class="next-action-form-item">
          <el-input
            v-model="detailRow.potPotentialMaster.nextAction"
            class="width-zoom-1"
            :disabled="isReadOnly"
            maxlength="255"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="次回約束日" prop="nextPromiseDate" class="next-action-form-item">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.nextPromiseDate"
            style="width: var(--width-zoom-1);"
            :disabled="isReadOnly"
            type="date"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="時刻" prop="nextPromiseTime" class="next-action-form-item">
          <el-time-select
            v-model="detailRow.potPotentialMaster.nextPromiseTime"
            class="width-zoom-1"
            :disabled="isReadOnly">
          </el-time-select>
        </el-form-item>
      </div>
      <!-- <div class="dynamic-container">
        <el-form-item label="見解書作成日" prop="reportCreationDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.reportCreationDate"
            type="date"
            style="width: var(--width-zoom-1);"
            :disabled="isReadOnly"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="見解書送付日" prop="reportSendingDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.reportSendingDate"
            type="date"
            style="width: var(--width-zoom-1);"
            :disabled="isReadOnly"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="S/Aランク連絡日" prop="saRankNotificationDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.saRankNotificationDate"
            type="date"
            style="width: var(--width-zoom-1);"
            :disabled="isReadOnly"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="面談アポイント日" prop="interviewAppointmentDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.interviewAppointmentDate"
            type="date"
            style="width: var(--width-zoom-1);"
            :disabled="isReadOnly"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="相談実施日" prop="consultationDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.consultationDate"
            type="date"
            style="width: var(--width-zoom-1);"
            :disabled="isReadOnly"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="面談ランク" prop="interviewRank">
          <elx-select
            v-model="detailRow.potPotentialMaster.interviewRank"
            selectKey="SCM_INTERVIEW_RANK"
            class="width-zoom-1"
            :disabled="isReadOnly"
          >
          </elx-select>
        </el-form-item>
      </div>
      <div class="dynamic-container">
        <el-form-item label="コンサル契約" prop="potPotentialMaster.consultingContract">
          <elx-radio-group
            v-model="detailRow.potPotentialMaster.consultingContract"
            selectKey="SCM_CONSULTING_STAGE"
            groupName="gtpName2"
            :disabled="isReadOnly"
          >
          </elx-radio-group>
        </el-form-item>
        <el-form-item label="コンサル契約書" prop="consultingContractDoc">
          <elx-select
            v-model="detailRow.potPotentialMaster.consultingContractDoc"
            selectKey="SCM_CONSULTANCY_AGREEMENT_STAGE"
            class="width-zoom-1"
            :disabled="isReadOnly"
          >
          </elx-select>
        </el-form-item>
        <el-form-item label="契約書発送日" prop="contractSendingDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.contractSendingDate"
            type="date"
            style="width: var(--width-zoom-1);"
            :disabled="isReadOnly"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="契約書発送ワーカー" prop="contractSendingWorker">
          <el-input
            v-model="detailRow.potPotentialMaster.contractSendingWorker"
            class="width-zoom-1"
            maxlength="100"
            :disabled="isReadOnly"
          >
          </el-input>
        </el-form-item>
      </div> -->
      <div class="dynamic-container">
        <el-form-item label="作成日" prop="entryDate">
          <el-date-picker
            v-model="detailRow.potPotentialMaster.entryDate"
            type="date"
            style="width: var(--width-zoom-1);"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="作成対応ワーカー" prop="entryWorker">
          <!-- <el-input
            v-model="detailRow.potPotentialMaster.entryWorker"
            class="width-zoom-1"
            maxlength="100"
          > </el-input> -->
          <elx-select v-model="detailRow.entryWorker" class="width-zoom-1" selectUrl="/sys/user/qryByUserType/3,4"  keyName = "id" labelName = "fullName"></elx-select>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container" style="margin-bottom: 0px;">
        <el-form-item label="実費見積 - 詳細">
          <TableAddDocCost :tableColumns="addDocTableTransportColumns"
                           :tableUrl="tableUrlAddDocTransport"
                           :bizDataNo="detailRow.potPotentialMaster.id"
                           :isReadOnly="isReadOnly"
                           ref="tableComtRefAddTransport"/>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 25px;">
        <el-button>実費見積書作成</el-button>
      </div>
      <el-divider></el-divider>
      <div class="dynamic-container" style="margin-bottom: 0px;">
        <el-form-item label="実費請求 - 詳細">
          <TableAddDocCost :tableColumns="addDocTableColumnsCost"
                           :tableUrl="tableUrlAddDocCost"
                           :bizDataNo="detailRow.potPotentialMaster.id"
                           :isReadOnly="isReadOnly"
                           ref="tableComtRefAddDocCost"/>
        </el-form-item>
      </div>
      <div class="dynamic-container" style="margin-bottom: 25px;">
        <el-button>請求書作成</el-button>
      </div>
      <div class="dynamic-container" >
      <el-form-item label="失注理由" prop="lostReason">
      <el-input
        v-model="detailRow.potPotentialMaster.lostReason"
        maxlength="255" class="width-zoom-2"
        :disabled="isReadOnly">
      </el-input>
    </el-form-item>
    <el-form-item label="失注顧客アンケート送付日" prop="lostCustomerSurveyDate">
      <el-date-picker
      v-model="detailRow.potPotentialMaster.lostCustomerSurveyDate"
      type="date" style="width: var(--width-zoom-1);"
      :disabled="isReadOnly">
    </el-date-picker>
    </el-form-item>  
  </div>
    </el-card>
    <el-card class="el-crd-cls" >
      <template #header><span class="card-header">ニーズ情報</span></template>
      <div class="dynamic-container-top dynamic-container">
        <el-form-item label="片付け" prop="potNeedsInfo.cleaningNeeds">
          <elx-radio-group 
          v-model="detailRow.potNeedsInfo.cleaningNeeds" 
          selectKey="SCM_NEEDS"
          groupName="gtpName2" 
          :disabled="isReadOnly">
        </elx-radio-group>
        </el-form-item>
        <el-form-item label="火災" prop="potNeedsInfo.fireDamageNeeds">
          <elx-radio-group 
          v-model="detailRow.potNeedsInfo.fireDamageNeeds" 
          selectKey="SCM_NEEDS" 
          groupName="gtpName2" 
          :disabled="isReadOnly">
        </elx-radio-group>
        </el-form-item>
        <el-form-item label="損保保険会社" prop="insuranceCompany">
      <el-input
        v-model="detailRow.potNeedsInfo.insuranceCompany"
        maxlength="100" class="width-zoom-1"
        :disabled="isReadOnly">
      </el-input>
    </el-form-item>
      </div>
      <div class="dynamic-container" >
        <el-form-item label="管理" prop="potNeedsInfo.managementNeeds">
          <elx-radio-group 
          v-model="detailRow.potNeedsInfo.managementNeeds" 
          selectKey="SCM_NEEDS" 
          groupName="gtpName2" 
          :disabled="isReadOnly">
        </elx-radio-group>
        </el-form-item>
        <el-form-item label="仏壇お墓" prop="potNeedsInfo.buddhistAltarGraveNeeds">
          <elx-radio-group 
          v-model="detailRow.potNeedsInfo.buddhistAltarGraveNeeds" 
          selectKey="SCM_NEEDS" 
          groupName="gtpName2" 
          :disabled="isReadOnly">
        </elx-radio-group>
        </el-form-item>
        <el-form-item label="相続登記" prop="inheritanceRegistration">
          <elx-select v-model="detailRow.potNeedsInfo.inheritanceRegistration"
          selectKey="SCM_INHERITANCE_REGISTRATION"
          class="width-zoom-1"
          :disabled="isReadOnly">
          </elx-select>
        </el-form-item>
      </div>
      <el-divider></el-divider>
      <div class="width-history-1" >
        <el-form-item label="出口戦略">
          <!-- :tableDataVal="tableDataExport" -->
          <TableAddExport :tableColumns="addDocTableColumnsExport"
                           :tableUrl="lisExportUrl"
                           bizDataType="pot"
                           :bizDataNo="detailRow.potPotentialMaster.id"
                           :isReadOnly="isReadOnly"
                           :key="$forceReload()"
                           ref="tableComtRefAddExport"/>
        </el-form-item>
      </div>
    </el-card>
    <!-- <el-card class="el-crd-cls">
      <template #header><span class="card-header">一時的ボタンエリア</span></template>
      <div class="dynamic-container" >
        <el-button type="primary" @click="save" :loading="loadingSave" v-show="!isReadOnly">保存</el-button>
      </div>
    </el-card> -->
    <div class="detail-btn-group-cls">
        <el-button type="primary" @click="save" v-show="!isReadOnly" :loading="loadingSave">保存する</el-button>
        <el-button @click="emit('close')">閉じる</el-button>
    </div>
    <!-- 问和页面引用 -->
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

  <!-- PDF预览对话框 -->
  <el-dialog v-model="viewFileFlag" title="プレビュー" width="80%">
    <PdfEmbedVierwer :fileId="viewFileId" :key="$forceReload()"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import {defineProps, defineEmits, reactive, ref} from 'vue';
const tableDataCost = ref<[]>([]);
const tableDataExport = ref<[]>([]);
const tableDataHistory = ref<[]>([]);
const emit = defineEmits(['save', 'close']);
const lisExportUrl = ref("/pot/export/strategy/list");
import TableAddDocCost from '@/components/TableCommAddDoc.vue'
import TableAddExport from '@/components/TableCommAddDoc.vue'
import aplInquiryMgntListSelect from '@/pages/apl/aplInquiryMgntList.vue'
import sysUserList from '@/pages/sys/sysUserList.vue'
// import axios from 'axios' // 引入 axios
import {useFetch} from '#app'
import {ElMessage, ElMessageBox} from 'element-plus'
import type { ComponentSize, FormProps } from 'element-plus'
import {onMounted} from "vue";
import TableAddDoc from '@/components/TableCommAddDoc.vue'
import '~/assets/css/app.css';
// const tableUrlAddDoc = ref("");
const labelPosition = ref<FormProps['labelPosition']>('top');
/*init fields*/
const loadingSave = ref(false);
const {$api} = useNuxtApp()
const damiAddress = ref('');
const tableComtRefAddExport = ref(null);
const tableComtRefAddTransport = ref(null);
const tableComtRefAddDoc = ref(null)
const tableComtRefAddDocCost = ref(null)
const tableUrlAddDocCost = ref("/pot/square/invoice/send/date/list")
const tableUrlAddDocTransport = ref("/pot/squareinvoice/transport/list")
import { Search } from '@element-plus/icons-vue'
const potManagerWorker = ref('')
const potManagerCt = ref('')
const updRowRef = ref();
const viewFileId = ref(''); // 用于存储要预览的 PDF 文件 ID
const viewFileFlag = ref(false); // 用于存储要预览的 PDF 文件 ID

const props = defineProps({
  editUrl: String,
  isReadOnly: Boolean,
  detailRow: {
    type: Object,
    required: true,
  }
});
const addDocTableColumns = [
{ prop: 'actionDate', label: '日付', inTyp: 'date', width: '160'},
{ prop: 'actionContent', label: '内容' , inTyp: 'textarea', width: '700'},
]

const addDocTableTransportColumns = [
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

const submitRuleFormAddExport = async () => {
  const tableData = tableComtRefAddExport.value.getTableData();
  console.log('表データExport:', tableData);
}

// const potInquiryIdCtSearch = () => {
//     console.log('搜索内容:', inquiryId)
// }

const formatNumber = (value: number) => {
  if (!value) return '0';
  return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// const formatTelNumber = () => {
//   const numbers = props.detailRow.potCustomerInfo.phoneNumber.replace(/[^0-9]/g, '');
//   if (numbers.length === 10) {
//     props.detailRow.potCustomerInfo.phoneNumber = numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
//   } else if (numbers.length === 11) {
//     props.detailRow.potCustomerInfo.phoneNumber = numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
//   }
// };

const formatTelNumber = () => {
  return;
  const numbers = props.detailRow.potCustomerInfo.phoneNumber.replace(/[^0-9]/g, '');

  if (numbers.length === 11) {
    // 手机格式，如 090-1234-5678
    props.detailRow.potCustomerInfo.phoneNumber= numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  } else if (numbers.length === 10) {
    if (numbers.startsWith('03') || numbers.startsWith('06')) {
      // 东京都区部、大阪，格式如 03-1234-5678
      props.detailRow.potCustomerInfo.phoneNumber= numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '$1-$2-$3');
    } else if (numbers.startsWith('011') || numbers.startsWith('045') || numbers.startsWith('092')) {
      // 北海道、横滨、福冈等地，格式如 011-123-4567
      props.detailRow.potCustomerInfo.phoneNumber= numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    } else {
      // 默认 fallback：3-3-4（不准确但安全）
      props.detailRow.potCustomerInfo.phoneNumber= numbers.replace(/^(\d{3})(\d{3})(\d{4})$/, '$1-$2-$3');
    }
  }
};

const formatMobileNumber = () => {
  return;
  if (!props.detailRow.potCustomerInfo.mobileNumber) return;
  
  // 数字のみを抽出
  const numbers = props.detailRow.potCustomerInfo.mobileNumber.replace(/[^0-9]/g, '');
  
  // 11桁の場合のみフォーマット
  if (numbers.length === 11) {
    props.detailRow.potCustomerInfo.mobileNumber = numbers.replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
  }
};
const formatPostalCode = () => {
  if (!props.detailRow.potCustomerInfo.residencePostalCode) return;
  const numbers = props.detailRow.potCustomerInfo.residencePostalCode.replace(/[^0-9]/g, '');
  if (numbers.length === 7) {
    props.detailRow.potCustomerInfo.residencePostalCode = numbers.slice(0, 3) + '-' + numbers.slice(3);
  }
};
const parseNumber = (value: string) => {
  if (!value) return '';
  return value.replace(/(,*)/g, '');
};

onMounted(() => {
  // 初期表示時のフォーマット処理
  if (props.detailRow.potCustomerInfo.mobileNumber) {
    formatMobileNumber();
  }
  if (props.detailRow.potCustomerInfo.phoneNumber) {
    formatTelNumber();
  }
  if (props.detailRow.potCustomerInfo.residencePostalCode) {
    formatPostalCode();
  }
  props.detailRow.potPotentialMaster.tempId = props.detailRow.potPotentialMaster.id || '';
});

// onMounted(() => {
//     if (props.detailRow.potPotentialMaster && props.detailRow.potPotentialMaster.inquiryId) {
//       selectDialogVisible.value = true;
//     }
//   });


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
        potPotentialMaster: props.detailRow.potPotentialMaster,
        potRealEstateSummary: props.detailRow.potRealEstateSummary,
        potNeedsInfo: props.detailRow.potNeedsInfo,
        potCustomerInfo: props.detailRow.potCustomerInfo,
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
    ElMessage({type: 'error', message: 'Failed to retrieve data: '+error, style: 'z-index: 3000;'});
  }finally {
    loadingSave.value = false;
  }
};

const rules = {
  'potCustomerInfo.residence': [{required: true, message: '居住地を選択してください', trigger: ['blur', 'change']}],
  'potPotentialMaster.consultingContract': [{required: true, message: 'コンサル契約を入力してください ', trigger: ['blur', 'change']},],
  'potNeedsInfo.cleaningNeeds': [{required: true, message: '片付けニーズを入力してください', trigger: ['blur', 'change']},],
  'potNeedsInfo.fireDamageNeeds': [{required: true, message: '火災ニーズを入力してください', trigger: ['blur', 'change']},],
  'potNeedsInfo.managementNeeds': [{required: true, message: '管理ニーズを入力してください', trigger: ['blur', 'change']},],
  'potNeedsInfo.buddhistAltarGraveNeeds': [{required: true, message: '仏壇お墓ニーズを入力してください', trigger: ['blur', 'change']},],
  'potCustomerInfo.residencePostalCode': [{
    required: false,
    pattern: /^\d{3}-\d{4}$/,
    message: '正しい郵便番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'potCustomerInfo.phoneNumber': [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しいTELの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'potCustomerInfo.mobileNumber': [{
    required: false,
    pattern: /^[0-9]{10,11}$/,
    message: '正しい携帯番号の形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'potCustomerInfo.emailAddress': [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
  'potCustomerInfo.reportSendingEmail': [{
    required: false,
    type: 'email',
    message: '正しいメールアドレスの形式で入力してください',
    trigger: ['blur', 'change']
  }],
};

const isWorker = ref(true);
const managerInput = ref('');

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
  props.detailRow.potPotentialMaster.inquiryId = lineData.aplInquiryMgnt.id; // 修正：移除 .value
  //相談者名
  props.detailRow.potCustomerInfo.consultantName = lineData.aplInquiryMgnt.customerName;
  //フリガナ
  props.detailRow.potCustomerInfo.furigana = lineData.aplInquiryMgnt.nameFurigana;
  //メールアドレス
  props.detailRow.potCustomerInfo.emailAddress = lineData.aplInquiryMgnt.loginEmail
  //見解書送付希望メールアドレス
  props.detailRow.potCustomerInfo.reportSendingEmail = lineData.aplInquiryMgnt.contactEmail
  //電話番号
  props.detailRow.potCustomerInfo.mobileNumber = lineData.aplInquiryMgnt.phoneNumber
  //現在の居住地
  props.detailRow.potCustomerInfo.currentResidence = lineData.aplInquiryMgnt.currentRegion
  //書面郵送宛名
  props.detailRow.potCustomerInfo.postalAddress = lineData.aplInquiryMgnt.reportRecipientName
  //流入経路
  props.detailRow.potPotentialMaster.potSource = lineData.aplInquiryMgnt.aplSource

  console.log(lineData.aplInquiryMgnt.aplSource);
  //ランク
  props.detailRow.potPotentialMaster.potRank = lineData.aplInquiryMgnt.aplRank

  // Q11.value = lineData.aplInquiryMaster.Q11;
  // Q12.value = lineData.aplInquiryMaster.Q12;
  // Q13.value = lineData.aplInquiryMaster.Q13;
  // Q1301.value = lineData.aplInquiryMaster.Q1301;
  // Q14.value = lineData.aplInquiryMaster.Q14;
  // Q15.value = lineData.aplInquiryMaster.Q15;
  // Q1501.value = lineData.aplInquiryMaster.Q1501;
  selectDialogVisible.value = false;
};

const pageUrl = ref("/pot/potential/master");

// const fetchInquiryData = async () => {
//   if (props.detailRow.potPotentialMaster.inquiryId) {
//     try {
//       const response = await useNuxtApp().$api(`${pageUrl.value}/${props.detailRow.potPotentialMaster.id}`);

//       Q11.value = response.data.aplInquiryMaster.Q11;
//       Q12.value = response.data.aplInquiryMaster.Q12;
//       Q13.value = response.data.aplInquiryMaster.Q13;
//       Q1301.value = response.data.aplInquiryMaster.Q1301;
//       Q14.value = response.data.aplInquiryMaster.Q14;
//       Q15.value = response.data.aplInquiryMaster.Q15;
//       Q1501.value = response.data.aplInquiryMaster.Q1501;
//     } catch (error) {
//       ElMessage.error('データの取得に失敗しました。');
//       console.log(error);
//     }
//   }
// }

onMounted(() => {
  // fetchInquiryData();
});

const selectUserWorkerDialogVisible = ref(false)
const openSelectUserWorkerDialog = () => { 
  selectUserWorkerDialogVisible.value = true;
}
const handleSelectUserWorker = (userData: any) => {
  props.detailRow.potPotentialMaster.potManagerWorker = userData.fullName
  selectUserWorkerDialogVisible.value = false
}

// 选择 CT 用户
const selectUserCtDialogVisible = ref(false)

// 打开 CT 用户选择对话框
const openSelectUserCtDialog = () => {
  selectUserCtDialogVisible.value = true;
}

// 选择 CT 用户
const handleSelectUserCt = (userData: any) => {
  props.detailRow.potPotentialMaster.potManagerCt = userData.fullName
  selectUserCtDialogVisible.value = false
}

// 新增：通过 fileId 展示 PDF
const showPdfByFileId = (fileId: string) => {
  viewFileId.value = fileId; // 设置要预览的 PDF 文件 ID
  viewFileFlag.value = true; // 设置预览标志
};

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
