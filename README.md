# PDFAutomation
Microservice integration that automates packing list delivery to a company's fulfillment chain.

>IMPORTANT
>This code has been scrubbed of sensitive data, and due to the data needing to be fetched from internal servers, the code will not run. It is currently intended to showcase the architecture and code. (8/2/23) Test data will be put together soon in order to showcase a working model.

## Overview and Program Flow
The trigger function is hosted on AWS Lambda and is fired off based on a schedule. It compares an old snapshot of invoice data against fresh data, and if there are discrepancies, the snapshot is updated. If the discrepant invoice shows a paid balance, the PDF creator Lambda function fires, delivering the PDF to the companies Warehouse inbox for fulfillment.

## More Details

### Trigger:
- Written using Node.js
- Hosted on AWS Lamda
- Fired off based on a schedule implemented using Amazon EventBridge
- A snapshot of invoice data is stored in an AWS S3 Bucket, which is called using the aws-sdk S3 client
  - Snapshot is updated when there are discrepencies between it and fresh data
  - Data is fetched using Method:CRM's API
- Secrets such as API keys are stored and served as environment variables
- Unit tests written using JEST

### PDF Creator:
- Written using Node.js
- Deployed using AWS Serverless Application Model
- Hosted on AWS Lambda
- Utilizes native Node.js libraries such as fs, stream, FormData and node-fetch
- PDF is built using this [library (pdf-lib)](https://www.npmjs.com/package/pdf-lib?activeTab=readme)
- Secrets such as API keys are stored and served as environment variables
- PDF bytes are converted between various encodings depending on usecase
  - Base64 to Binary encoding for storing PDF locally and transmitting it within a FormData payload via RESTful API

  
  
