import { z } from "zod";
import { env } from "../../../env/server.mjs";
import { router, publicProcedure } from "../trpc";
import { OpenAIApi, Configuration } from "openai";
import * as fs from "fs";
import S3 from "aws-sdk/clients/s3";
import { randomUUID } from "crypto";
import { pipeline } from "stream/promises";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_KEY,
  region: env.AWS_REGION,
  signatureVersion: "v4",
});

const configuration = new Configuration({
  apiKey: env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// //get audio file

// const audioFile = fs.createReadStream("src/server/audio/test.mp3");

// const raw_transcription = await openai.createTranscription(
//   audioFile,
//   "whisper-1"
// );

// const transcription = raw_transcription.data.text;
// // const transcription = `Sir Matthew Thompson is our first finalist today. He's from the University of Queensland in the School of Psychology and National ICT Australia, Faculty of Social and Behavioural Sciences. The name of his thesis is Structure and Features in Complex Visual Stimuli, Assisting Identification in Forensics, and the short name for us here today has been translated to the three minute version, Suspects, Science and CSI. Will you please make Matthew very welcome. I used to think that when a crime was committed, the police dusted for fingerprints, put them into a computer and up popped the driver's licence with the person who committed the crime, right? Well unfortunately it's not that easy. Contrary to what you see on CSI, it's not computers that match prints, it's humans. This is a fingerprint examiner and his job is to look back and forth at a pair of prints and decide whether the crime scene print matches the suspect or not. My PhD thesis is about understanding how examiners make these important decisions. In Australia alone there are over 5,000 of these comparisons made per day to be used as evidence in convicting criminals, but occasionally mistakes are made. In 2004 a lawyer named Brandon Mayfield was arrested by the FBI because his fingerprints matched those found on a bomb that exploded, killing 191 people. But here's the catch, the fingerprint examiners made a mistake, they matched a print to the wrong person. Mayfield was innocent. So how can this happen? Well it turns out that despite them testifying in court for the past 100 years, fingerprint examiners have never been scientifically tested for how accurately they can match prints. In my PhD I started by testing the accuracy of fingerprint examiners at police stations in Queensland, New South Wales, Victoria, South Australia and the Australian Federal Police in Canberra. I put them in a situation similar to their usual work, but I maintained tight experimental control by using simulated crime scene prints in a signal detection paradigm. More simply, I wanted to find out how many guilty people were being wrongly set free and how many innocent people were being wrongfully convicted. Well this was the first ever test of fingerprint expertise and as you might hope the examiners were extremely accurate, but not perfect. I breathed a sigh of relief when I saw that the examiners could actually do what they claim, but the challenge now is to see how these findings translate to performance outside the lab. As well as accuracy, I'm interested in the basics of how it is that humans process complex visual patterns such as fingerprints. I want to turn novices into experts more quickly and I'm discovering ways of improving their accuracy. Last month my research was presented to judges at the Supreme Court. The experiments from my PhD are changing the way we think about presenting fingerprint evidence to judges and juries. So where to from here? Well next year I'm heading to LA to continue my research with law enforcement agencies in the US. I'll apply my fingerprint work across other areas of forensics like shoe prints, blood spatter and even DNA to help ensure that innocent people are not wrongfully accused. Thank you.`;

// const raw_summary = await openai.createChatCompletion({
//   model: "gpt-3.5-turbo-0301",
//   messages: [
//     {
//       role: "user",
//       content: "Summarise this text for me please: \n" + transcription,
//     },i
//   ],
// });
// const summary = raw_summary.data.choices[0]?.message;

export const openaiRouter = router({
  // hello: publicProcedure.query(summary.data.choices[0].text),
  transcription: publicProcedure.query(() => {
    return {
      // transcription,
      // summary,
      transcription: "asdasdasd",
      summary: "asdasdasdasdasdasdasd",
    };
  }),
  transcribe: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const obj = s3.getObject({
      Bucket: "22parent-signed",
      Key: input,
    });

    await pipeline(
      obj.createReadStream(),
      fs.createWriteStream("src/server/audio/test2.mp3")
    );

    const upfile = fs.createReadStream("src/server/audio/test2.mp3");

    const raw_transcription = await openai
      .createTranscription(upfile, "whisper-1")
      .catch((err) => {
        console.log(err);
      });

    console.log(raw_transcription);
    const transcription = raw_transcription.data.text;

    console.log(transcription);

    return transcription;
  }),
  test: publicProcedure.query(async () => {
    const obj = s3.getObject({
      Bucket: "22parent-signed",
      Key: "Three Minute Thesis (3MT) 2011 Winner - Matthew Thompson.mp3",
    });

    await pipeline(
      obj.createReadStream(),
      fs.createWriteStream("src/server/audio/test2.mp3")
    );

    const upfile = fs.createReadStream("src/server/audio/test2.mp3");

    const raw_transcription = await openai
      .createTranscription(upfile, "whisper-1")
      .catch((err) => {
        console.log(err);
      });

    console.log(raw_transcription);
    const transcription = raw_transcription.data.text;

    console.log(transcription);

    return transcription;
  }),
});
