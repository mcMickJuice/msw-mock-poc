// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

// ...not yet used by tthe client. not sure what i'm doing here yet
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  console.log("this is a test", req.url);
  res.status(200).json({ name: "John Doe" });
}
