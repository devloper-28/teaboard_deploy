/* eslint-disable import/prefer-default-export */
import { all } from "redux-saga/effects";

import dummySagas from "./dummy/dummy";
import authSagas from "./auth/auth";
import toggleSaga from "./toggle/toggle";
import auctionCenterRootSagas from "./auction/auction";
import saleSagas from "./sale/sale";
import teaType from "./teaType/TeaType";
import { watchFetchGrade } from "./grade/Grade";
import { watchFetchWarehouseUser } from "./warehouse/warehouse";
import {
  watchFetchCategory,
  watchFetchCategoryById,
} from "./bindCategory/bindcategory";
import {
  watchAddInvoiceDetails,
  watchDeleteInvoiceDetails,
  watchFetchInvoiceDetails,
  watchFetchInvoiceDetailsById,
  watchUpdateInvoiceDetails,
} from "./invoice/invoice";
import watchFetchKutchaCatalogue from "./kutcha/kutcha";
import sessionTypesSaga from "./sessiontype/sessiontype";
import awrSaga from "./awr/awr";
import markData from "./mark/Mark";
import { allAuctionCenterSaga } from "./createAuctionCenter/auctionCenterSagas";
import { TeaTypesSaga } from "./createTeaType/teatypeSagas";
import { gradeSagas } from "./createGrade/gradeSagas";
import { factorysSagas } from "./createFactory/factorySagas";
import { subTeaTypesSaga } from "./createSubTeaType/subTeaTypeSagas";
import { roleSaga } from "./createRole/roleSagas";
import { categorysSaga } from "./createCategory/categorySagas";
import { plantationSaga } from "./createPlantation/plantationSagas";
import { revanueSaga } from "./createRevanue/revanueSagas";
import { stateSaga } from "./createStateMaster/stateSagas";
import watchLotNotSeriesSaga from "./lotnoseries/lotnoseries";
import createdSaleNo from "./createdSaleNo/CreatedSaleNo";
import { documentSaga } from "./uploadDocument/uploadDocumentSagas";
import sampleshortagesaga from "./sampleshortage/sampleshortage";
import { getAllchargeCodesSaga } from "./chargeCode/chargeCode";
import { BankAcsSaga } from "./createBankAcDetail/getAllBankAcDetail";
import { TaxMastersSaga } from "./createTaxMaster/getAllTaxMaster";
import { SpusSaga } from "./createSpu/getAllSpu";
import { configParamSagas } from "./configParamSagas/configParamSagas";
import warehouseUserRegistration from "./warehouseUserRegistration/warehouseUserRegistration";
import { watchFetchGroups } from "./groupMaster/groupMaster";
import chargeSaga from "./createChargeMaster/chargeSaga";

export default function* rootSaga() {
  yield all([
    dummySagas(),
    authSagas(),
    toggleSaga(),
    auctionCenterRootSagas(),
    saleSagas(),
    teaType(),
    markData(),
    watchFetchWarehouseUser(),
    watchFetchGrade(),
    watchFetchCategory(),
    watchFetchInvoiceDetails(),
    watchFetchInvoiceDetailsById(),
    watchAddInvoiceDetails(),
    watchUpdateInvoiceDetails(),
    watchDeleteInvoiceDetails(),
    watchFetchCategoryById(),
    watchFetchKutchaCatalogue(),
    sessionTypesSaga(),
    awrSaga(),
    watchLotNotSeriesSaga(),
    sampleshortagesaga(),
    createdSaleNo(),
    watchFetchGroups(),

    getAllchargeCodesSaga(),
    configParamSagas(),
    TaxMastersSaga(),
    SpusSaga(),
    documentSaga(),
    stateSaga(),
    allAuctionCenterSaga(),
    TeaTypesSaga(),
    gradeSagas(),
    factorysSagas(),
    subTeaTypesSaga(),
    roleSaga(),
    categorysSaga(),
    plantationSaga(),
    revanueSaga(),
    warehouseUserRegistration(),
    chargeSaga(),
    BankAcsSaga(),
  ]);
}
