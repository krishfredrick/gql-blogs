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
  
  const input = { 
    Source: "noobielearner4@gmail.com", 
    Destination: { 
      ToAddresses: [ 
        "testing0rk@yopmail.com",
      ],
      
    },
    Message: { 
      Subject: { 
        Data: "Generating OTP", 
        Charset: "utf-8",
      },
      Body: { // Body
        Text: {
          Data: `Change Password otp ${otp}`,
          Charset: "utf-8",
        },
      
      },
    },

  };
  const command = new SendEmailCommand(input);
  const response = await client.send(command);
  console.log({emailResponse: response})
  return response;
}


