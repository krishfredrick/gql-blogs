import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"; 

const { ACCESS_KEY, SECRET_KEY, REGION } = process.env;
if(!ACCESS_KEY || !SECRET_KEY){
  console.log(` ACCESS_KEY ${ACCESS_KEY} or SECRET_KEY ${SECRET_KEY} not Available`);
}
const client = new SESClient({
  apiVersion: "2.0.1",
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY as string,
    secretAccessKey: SECRET_KEY as string,
  },
});

export const sendEmail = async function(otp: string) {
  
  const input = { // SendEmailRequest
    Source: "noobielearner4@gmail.com", // required
    Destination: { // Destination
      ToAddresses: [ // AddressList
        "testing0rk@yopmail.com",
      ],
      // CcAddresses: [
      //   "STRING_VALUE",
      // ],
      // BccAddresses: [
      //   "STRING_VALUE",
      // ],
    },
    Message: { // Message
      Subject: { // Content
        Data: "Generating OTP", // required
        Charset: "utf-8", // required
      },
      Body: { // Body
        Text: {
          Data: `Change Password otp ${otp}`, // required
          Charset: "utf-8",
        },
        // Html: {
        //   Data: "STRING_VALUE", // required
        //   Charset: "STRING_VALUE",
        // },
      },
    },
    // ReplyToAddresses: [
    //   "STRING_VALUE",
    // ],
    // Tags: [ // MessageTagList
    //   { // MessageTag
    //     Name: "STRING_VALUE", // required
    //     Value: "STRING_VALUE", // required
    //   },
    // ],
    // ConfigurationSetName: "STRING_VALUE",
  };
  const command = new SendEmailCommand(input);
  const response = await client.send(command);
  console.log({emailResponse: response})
  return response;
}


