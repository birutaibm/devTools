const SqlInsertsChanger = require('./files/sql/SqlInsertsChanger');

async function doIt() {
  try {
    const paymentsChanger = new SqlInsertsChanger(
      '~/Downloads/rtm20241011/payments_export_2024-10-11_095812.sql',
      '~/Downloads/rtm20241011/payments_sanitizado.sql',
      {
        id: null,
        project_id: 1,
        merchant_id: 1,
        acquirer_id: 1,
        liquidation_unique_number: null,
        dt_return_processment_bank: null,
        dt_paid: null,
        return_pro_processment_file_name: null,
        return_processment_file_name: null,
        return_payment_file_name: null,
        status: 'WAITING_BANK_RESPONSE',
        return_pro_processment_code: null,
        return_pro_processment_description: null,
        return_processment_code: null,
        return_processment_description: null,
        return_payment_code: null,
        return_payment_description: null,
      }
    );
    await paymentsChanger.replaceValues();
    console.log('Finished');
  } catch (error) {
    console.log(error);
  }
}

doIt();