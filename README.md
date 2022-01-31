# ETH BSC Bridge

#  โครงสร้างของ Code 

![bridgeStructure](./images/bridgeStructure.png)

โครงสร้างสำคัญของโปรเจคจะ แบ่งเป็น 3 ส่วนได้แก่ 
 - Bridge Contract ใช้สำหรับ burn token เมื่อเราต้องการที่จะส่ง token ข้าม chain token จะถูกเก็บไว้ที่ address 0 และจะทำการ mint token (Contract Bridge อีกฝั่งหนึ่ง) ไปที่ address เดี่ยวกันกับที่ส่ง transaction เข้ามา
 - Token Contract เป็น asset ที่ใช้ในการส่งผ่าน transaction  
 - Bridge API เป็น Trigger ดักจับ event ที่เราต้องการในกรณีนี้ event ที่เราต้องการดังจับคือ "Transfer" เมื่อดักจับได้ก็จะนำค่าที่อยู่ใน event มาใช้งานในการ mint token ให้ address เท่ากับจำนวนที่ได้ทำการ brun ไป

## อธิบาย  Code Smart Contract

## TokenBase.sol 

![TokenBase](./images/TokenBase.png)

TokenBase เป็น base class ที่จะใช้สร้าง Token ที่ใช้ในการทำเหรียญ 
มี State variable 2 ตัวได้เเก่ 
admin เป็นประเภท address มีหน้าที่ในการบอกว่าใครเป็น admin ของ contract นี้
deployer เป็นประเภท address มีหน้าที่ในการบอกว่าใครเป็นผู้ deploy contract 

function constructor จะทำการกำหนดค่าให้ตัวเเปล admin และ deployer ให้มีค่าเท่า address ของผู้สร้าง transaction (msg.sender) 

contract TokenBase จะประกอบไปด้วย 3 function หลักได้แก่

 - function udateAdmin 

 - function mint 

 - function burn 

โดยแต่ละ function จะอนุญาติให้ผู้เรียกใช้เป็น admin หรือ deployer เท่านั้น 

## BridgeBase.sol

![BridgeBase-1](./images/BridgeBase-1.png)

Contract BridgeBase ป็น base class ที่จะใช้สร้าง Bridge Contract 
ประกอบไปด้วย State variable 5 ตัวได้เเก่ 

 - admin เป็นประเภท address 
 - token เป็นประเภท Itoken ซึ้งมาจากอีก contract ใช้ในการ interract กับ contract ของ token 
 - nonce เป็นประเภท uint ใช้เพื่อเป็นตัว tracking ว่า transaction ถูกส่งมานั้นเป็นลำดับที่เท่าไหร่ 
 - processedNonces เป็นประเภท mapping ของ nonce เเต่ละ transaction ว่าถูกดำเนินการไปเเล้วหรือไม่ เช่น nonce ลำดับที่ 1 มีค่าเป็น false เป็นต้น
 - Step เป็นชนืด enum ที่มีค่าเป็น Burn และ Mint ใช้บอกสถานะของ transaction นั้นๆ 

 event Transfer เป็นสิ่งที่เราจะทำการ emit มันเมื่อมี transaction ที่เราต้องการเกิดขึ้น ซึ้งเราจะสามารถอ่านค่าของ event ได้จาก res ของ transaction นั้นๆ 

 function constructor ทำหน้ามราสำคัญสองอย่างคือ 
  - กำหนดค่าให้ตัวแปล admin ให้เท่ากับ address ของผู้ส่ง transaction 
  - กำหนดค่าให้ตัวแปล token* ทำให้เราสามารถสือสารกับ contract Token ผ่าน contract Bridge ได้ เช่น ทำการ mint token ผ่าน contract Bridge ได้เลยเป็นต้น (เมื่อเราทำการ deploy contract Bridge และ Token เราจำทำการเปลี่ยน address admin ของ contract Token ให้เป็น address ของ contract Bridge เพื่อให้สามารถเรียกใช้งาน function ได้ )

  ![BridgeBase-2](./images/BridgeBase-2.png)

contract Bridge มี function หลักอยู่ 2 function ได้แก่ 

 - function burn จะทำการเรียกใช้งาน function burn ของ contract Token หลังจากนั้นจะ emit event Transfer เพื่อให้ listener ที่เราได้ทำการวางไว้ดัก event ที่เกิดขึ้นและทำการ mint Token ไปยังอีก chain หนึ่งได้ function นี้จะไม่ทำการ require ให้เฉพาะ admin เรียกใช้ได้เพราะเราต้องการที่จะให้ทุกๆ address นั้นทำการ bridge token ได้

 - function mint จะถูกเรียกใช้เมื่อตัว listener ทำการดักจับ event Transfer ได้ จากนั้นจะทำการ เช็ค mapping ของ nonce ที่ transaction นั้นเป็น false หรือไม่ถ้าเป็นเเสดงว่า transaactions นั้นถูกนำเนินการไปเเล้ว หลังจากนั้นจะ set mapping nonce เป็น true และทำการ mint token ให้ address และทำการ emit transfer 

