import { NextApiRequest, NextApiResponse } from "next";
import { server } from "../../../mocks/server";
import { rest } from "msw";

type Data = {
  success: boolean;
};

export default function handler(
  stubReq: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (stubReq.body != null) {
    console.log(`mocking ${stubReq.body.url}`);
    server.use(
      // TODO allow for post, put, etc
      rest.get(stubReq.body.url, (req, res, ctx) => {
        return res.once(ctx.status(200), ctx.json(stubReq.body.data));
      })
    );
  }

  res.status(200).json({ success: true });
}
