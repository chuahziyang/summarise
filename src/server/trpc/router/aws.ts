import { env } from "../../../env/server.mjs";
import { router, publicProcedure } from "../trpc";
import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";
import { prisma } from "../../../server/db/client";
import z from "zod";
const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
  signatureVersion: "v4",
});

export const awsRouter = router({
  // hello: publicProcedure.query(summary.data.choices[0].text),
  getPreSignedUrl: publicProcedure.query(() => {
    const ext = "mp3";

    const Key = `${randomUUID()}.${ext}`;

    const s3Params = {
      Bucket: env.AWS_BUCKET_NAME,
      Key,
      Expires: 60,
      ContentType: "audio/mp3",
    };

    const url = s3.getSignedUrl("putObject", s3Params);

    return { url, Key };
  }),
  logURL: publicProcedure.input(z.string()).mutation(async (input) => {
    console.log("asdasd");
    const keys = await prisma.transcription.create({
      data: {
        key: input,
      },
    });
    console.log(keys);
    return keys;
  }),
});
