/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// [START gae_flex_quickstart]
const express = require('express');
var engine = require('ejs-locals');
const favicon = require('express-favicon');
var firebase = require("firebase");
const admin = require("firebase-admin");
console.log(__dirname);
const serviceAccount = require(__dirname+"/seychelles-dev-env-firebase-adminsdk-alaas-aa6ed2d677.json");

var path = require('path')
const bodyParser = require('body-parser');

const app = express();
 //body parser middleware
 app.use(express.json());
 app.use(bodyParser.json());
 //app.use(bodyParser.urlencoded({extended: false}));
 app.use(express.static(path.join(__dirname, 'public')));
 app.use(favicon(__dirname + '/public/favicon.png'));
 app.engine('ejs', engine);
 app.set('view engine', 'ejs');
 app.set('views', path.join(__dirname, 'views'));

//  firebase.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://seychelles-dev-env.firebaseio.com"
// });

//const db = admin.database();
// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
   projectId:"seychelles-dev-env",
   apiKey: "AIzaSyBaE4VqLu8JGgUkQiSO5pv52TCyh-H93zY",
   authDomain: "seychelles-dev-env.firebaseapp.com",
   databaseURL: "https://seychelles-dev-env.firebaseio.com",
   storageBucket: "gs://seychelles-dev-env.appspot.com",
   credential: admin.credential.cert(serviceAccount)
 };
 firebase.initializeApp(config);

 // Get a reference to the database service
 const db = firebase.firestore();
 
// const currencyList = [
//    {SNo:1,"Name":"Dollar","Value":"70"},
//    {SNo:2,"Name":"Pound","Value":"80"}
//   ];
const CurrencyRef = db.collection('CurrencyMaster');
const InvoiceRef = db.collection('InvoiceMaster');
const PORef = db.collection('POMaster');
// const InvoiceOrderList = [
//    {OrderNo:1,CurrencyName:"Dollar",FMTC:"FMTC",Amount:"70",Rate:"75",AmountReceived:"80"},
//    {OrderNo:2,CurrencyName:"British Pound",FMTC:"FMTC",Amount:"80",Rate:"85",AmountReceived:"90"}
//   ];

// const PurchaseOrderList = [
//    {OrderNo:1,CurrencyName:"Dollar",FM:"FM",Amount:"70",Rate:"75",AmountReceived:"80"},
//    {OrderNo:2,CurrencyName:"British Pound",FM:"FM",Amount:"8=",Rate:"85",AmountPaid:"90"}
//   ];
app.get('/', (req, res) => {
  //res
   //  .status(200)
   //  .send('Hello, world!')
   //  .end();
   //res.sendFile( __dirname + "/views/" + "index.html" );
   let InvoiceOrderList = [];
   let PurchaseOrderList = [];
   InvoiceRef.orderBy("OrderNo").get()
   .then(snapshot => {                              
      snapshot.forEach(doc => {
         InvoiceOrderList.push(doc.data());                                 
      });           
         PORef.orderBy("OrderNo").get()
         .then(snapshot => {                              
            snapshot.forEach(doc => {
               PurchaseOrderList.push(doc.data());                                 
            });           
            console.log(PurchaseOrderList);   
            res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList,PurchaseOrderList : PurchaseOrderList};  
            res.render("Home");                                                            
         })                                                            
   })
   .catch(err => {
      console.log('Error getting documents', err);
      res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList};  
      res.render("Home"); 
   });  
});

app.get('/TestPage', function (req, res) {   
   res.locals = {title : "TestPage"}; 
   res.render("TestPage");
})

// app.get('/index', function (req, res) {
//     res.sendFile( __dirname + "/" + "index.html" );
//  })

//  app.get('/SignUp', function (req, res) {
//    res.render("SignUp"); 
// })

 app.get('/Home', function (req, res) {
   let InvoiceOrderList = [];
   let PurchaseOrderList = [];
   InvoiceRef.orderBy("OrderNo").get()
   .then(snapshot => {                              
      snapshot.forEach(doc => {
         InvoiceOrderList.push(doc.data());                                 
      });           
         PORef.orderBy("OrderNo").get()
         .then(snapshot => {                              
            snapshot.forEach(doc => {
               PurchaseOrderList.push(doc.data());                                 
            });           
            console.log(PurchaseOrderList);   
            res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList,PurchaseOrderList : PurchaseOrderList};  
            res.render("Home");                                                            
         })                                                            
   })
   .catch(err => {
      console.log('Error getting documents', err);
      res.locals = {title : "Home",InvoiceOrderList : InvoiceOrderList};  
      res.render("Home"); 
   });  
})

//Invoice - Begins
app.get('/CreatePO', function (req, res) {   
   res.locals = {title : "Create PO"}; 
   res.render("CreatePO");
})

app.get('/CreatePOCopy', function (req, res) {   
   res.locals = {title : "Create PO Copy"}; 
   res.render("CreatePOCopy");
})

app.get('/ViewPO/:orderNo', function (req, res) {   
   let orderNo = parseInt(req.params.orderNo);
   let PurchaseOrderList = [];
   PORef.where("OrderNo", "==", orderNo).get()
   .then(snapshot => {                              
      snapshot.forEach(doc => {
         PurchaseOrderList.push(doc.data());                                 
      });           
      console.log("list: ", PurchaseOrderList);
      res.locals = {title : "Purchase Order Details",PurchaseOrderList:PurchaseOrderList};
      res.render("ViewPO");                                                              
   })
   .catch(err => {
      console.log('Error getting documents', err);
      res.send(err);
   }); 
})

app.get('/CreateInvoice', function (req, res) {   
   res.locals = {title : "Create Invoice"}; 
   res.render("CreateInvoice");
})

app.get('/CreateInvoiceCopy', function (req, res) {   
   res.locals = {title : "Create Invoice copy"}; 
   res.render("CreateInvoiceCopy");
})

app.get('/ViewInvoice/:invoiceNo', function (req, res) {   
   let invoiceNo = parseInt(req.params.invoiceNo);
   let InvoiceOrderList = [];
   InvoiceRef.where("OrderNo", "==", invoiceNo).get()
   .then(snapshot => {                              
      snapshot.forEach(doc => {
         InvoiceOrderList.push(doc.data());                                 
      });           
      console.log("list: ", InvoiceOrderList);
      res.locals = {title : "View Invoice",InvoiceOrderList:InvoiceOrderList};
      res.render("ViewInvoice");                                                              
   })
   .catch(err => {
      console.log('Error getting documents', err);
      res.send(err);
   }); 
})
//Invoice - Ends


//CurrencyMaster -- Begins
 app.get('/CurrencyRate', function (req, res) {
   let list = [];
   CurrencyRef.orderBy("Name").get()
   .then(snapshot => {                              
      snapshot.forEach(doc => {
         let data = doc.data();
         data.Id=doc.id;
         list.push(data);                                 
      });           
      console.log(list);   
      res.locals = {title : "Currency Rate",currencyList : list};    
      res.render("CurrencyDetails");                                                            
   })
   .catch(err => {
      console.log('Error getting documents', err);
      res.locals = {title : "Currency Rate",currencyList : list};   
      res.render("CurrencyDetails"); 
   });  
 })


 //CurrencyMaster -- Ends
 app.get('/Exchange', function (req, res) {
    res.sendFile( __dirname + "/" + "src/template/ExchangeCurrency.html" );
 })

 //API Services

  //Get Purchase Order Details
  app.get('/api/Orders/InvoiceOrderList/', function (req, res) {
   //res.send(JSON.parse(currencyList));
   res.send(InvoiceOrderList);
})

 //Get Currency Details
 app.get('/api/Currency/GetCurrencyList/', function (req, res) {
   let list = [];   
   CurrencyRef.get()
            .then(snapshot => {                              
               snapshot.forEach(doc => {
                  let data =    doc.data();
                  data.Id  =  doc.id;
                  console.log("data: ", data);        
                  list.push(data);                    
               });           
               console.log(list);   
               res.send(list);                                                                
            })
            .catch(err => {
               console.log('Error getting documents', err);
               res.send(err);
            });      
});

async function GetCurrencyList(){
   let list = [];
   CurrencyRef.get()
               .then(snapshot => {                              
                  snapshot.forEach(doc => {
                     list.push(doc.data());                                 
                  });           
                  console.log(list);   
                  return list;                                                                 
               })
               .catch(err => {
                  console.log('Error getting documents', err);
                  return err;
               });    
   //return list;                            
};

//Get Currency Details by ID
 app.get('/api/Currency/GetCurrencyList/:id', function (req, res) {
   //let id = parseInt(req.params.id);
   let id =req.params.id;
   console.log("ID - "+id); 
   let list = [];
   //CurrencyRef.where("Id", "==", id).get()
   //CurrencyRef.get()
   // CurrencyRef.doc(id).get()
   //          .then(snapshot => {                              
   //             snapshot.forEach(doc => {
   //                list.push(doc.data());                                 
   //             });           
   //             console.log("GetCurrencyList result - "+list);   
   //             res.send(list);                                                               
   //          })
   //          .catch(err => {
   //             res.send('Error getting documents', err);
   //          }); 

      CurrencyRef.doc(id).get()
      .then(function(doc) {
         if (doc.exists) {
            console.log("Document data:", doc.data());
            let data = doc.data();
            data.Id = id;
            res.send(data); 
         } else {
            console.log("No such document!");
            res.send("No such document!");
         }
      }).catch(function(error) {
         console.log("Error getting document:", error);
      });
})

//============================================================================================================

//Create Purchase Order
app.post('/api/Currency/CreatePO/:OrderDetail',function(req, res){
   let OrderDetail = JSON.parse(req.params.OrderDetail);
   let PurchaseOrderList = {};
   let orderNo = 0;
   PORef.orderBy('OrderNo','desc').limit(1).get()
   .then(snapshot => {                              
      snapshot.forEach(doc => {
         PurchaseOrderList = doc.data();    
                                  
      });           
      OrderDetail.OrderNo = parseInt(PurchaseOrderList.OrderNo) + 1;      
      console.log("list: ", orderNo);
      //res.send(JSON.stringify(orderNo));         
      InsertPOData(OrderDetail,res);                                                     
   })
   .catch(err => {
      console.log('Error getting documents', err);
      res.send(err);
   }); 
});

//Create Invoice Order
app.post('/api/Currency/CreateInvoice/:OrderDetail',function(req, res){
   let OrderDetail = JSON.parse(req.params.OrderDetail);
   let InvoiceOrderList = {};
   let orderNo = 0;
   InvoiceRef.orderBy('OrderNo','desc').limit(1).get()
   .then(snapshot => {                              
      snapshot.forEach(doc => {
         InvoiceOrderList = doc.data();    
                                  
      });           
      OrderDetail.OrderNo = parseInt(InvoiceOrderList.OrderNo) + 1;      
      console.log("list: ", orderNo);
      //res.send(JSON.stringify(orderNo));         
      InsertInvoiceData(OrderDetail,res);                                                     
   })
   .catch(err => {
      console.log('Error getting documents', err);
      res.send(err);
   }); 
});

async function InsertPOData(OrderDetail,response){
   //let Address =  [OrderDetail.Address.AddressLine1,OrderDetail.Address.AddressLine2,OrderDetail.Address.AddressLine3];
   console.log("InsertPOData :: OrderDetail - " + OrderDetail);
   var addDoc = await PORef.add({
      OrderNo  :  OrderDetail.OrderNo,
      CurrencyId  :  1, 
      CurrencyName   :  OrderDetail.CurrencyName,
      FMTC : OrderDetail.FMTC,
      Amount   :  OrderDetail.Amount,
      Rate  :  OrderDetail.Rate,
      AmountPaid :  OrderDetail.AmountPaid,
      CustomerName : OrderDetail.CustomerName,
      Address  :{
         AddressLine1   :  OrderDetail.Address.AddressLine1,
         AddressLine2   :  OrderDetail.Address.AddressLine2,
         AddressLine3   :  OrderDetail.Address.AddressLine3
      }
    }).then(ref => {
      console.log('Added document with ID: ', ref.id);
      response.send("Success");
    }).catch(err => {
      console.log('Error adding documents', err);
      res.send(err);
   });
}

async function InsertInvoiceData(OrderDetail,response){
   //let Address =  [OrderDetail.Address.AddressLine1,OrderDetail.Address.AddressLine2,OrderDetail.Address.AddressLine3];
   //console.log(Address);
   var addDoc = await InvoiceRef.add({
      OrderNo  :  OrderDetail.OrderNo,
      CurrencyId  :  1, 
      CurrencyName   :  OrderDetail.CurrencyName,
      FM : OrderDetail.FM,
      Amount   :  OrderDetail.Amount,
      Rate  :  OrderDetail.Rate,
      AmountReceived :  OrderDetail.AmountReceived,
      CustomerName : OrderDetail.CustomerName,
      Address  :{
         AddressLine1   :  OrderDetail.Address.AddressLine1,
         AddressLine2   :  OrderDetail.Address.AddressLine2,
         AddressLine3   :  OrderDetail.Address.AddressLine3
      }
    }).then(ref => {
      console.log('Added document with ID: ', ref.id);
      response.send("Success");
    }).catch(err => {
      console.log('Error adding documents', err);
      res.send(err);
   });
}

//Update currency details
app.post('/api/Currency/UpdateCurrencyDetails/:currency',function(req, res){
   const currency = JSON.parse(req.params.currency);
   //console.log("currency - " +currency);
   CurrencyRef.doc(currency.Id).set({
      Name :   currency.Name,
      BuyingMin :    currency.BuyingMin,
      SellingMax :   currency.SellingMax
    });
   //console.log("Updating currency - "+currencyList);
   res.send("Success");
});
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_flex_quickstart]
