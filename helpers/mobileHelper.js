const Nexmo = require('nexmo');

const nexmo = new Nexmo({
  apiKey: '2a903a23',
  apiSecret: 'ixWg5FiHWqQw5oCQ',
});


exports.cancleVerfication = (id)=>{
    nexmo.verify.control({
        request_id: id,
        cmd: 'cancel'
      }, (err, result) => {
        if (err) {
          throw err ;
        } else {
          return result ;
        }
      });
      
}

exports.requestVerfication = (number)=>{

    nexmo.verify.request({
        number: number,
        brand: 'vijay'
      }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
        //   const verifyRequestId = result.request_id;
        //   console.log('request_id', verifyRequestId);
        }
      });

      
}

exports.checkVerfication = (id ,code)=>{

    nexmo.verify.check({
        request_id: id,
        code: code
      }, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(result);
        }
      });
      
}