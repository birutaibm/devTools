const SqlInsertsChanger = require('./files/sql/SqlInsertsChanger');

async function doIt() {
  try {
    const input = '~/Downloads/payments_export_2024-08-30_132324.sql';
    const output = 'payments.sql';
    
    const replaces = {
      project_id: `1`,
      merchant_id: `1`,
    };
    
    const changer = new SqlInsertsChanger(input, output, replaces);
    
    await changer.replaceValues();
    console.log('Output file created!');
    
    console.log('Finished');
  } catch (error) {
    console.log(error);
  }
}

doIt();