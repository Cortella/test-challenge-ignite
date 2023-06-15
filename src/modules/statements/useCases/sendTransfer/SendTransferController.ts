import { Request, Response } from "express";
import { container } from "tsyringe";

import { SendTransferUseCase } from "./SendTransferUseCase";

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  TRANSFER = "transfer",
}

class SendTransferController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { id: sender_id } = request.user;
    const type = "transfer" as OperationType;
    const { amount, description } = request.body;

    const sendTransfer = container.resolve(SendTransferUseCase);

    const statement = await sendTransfer.execute({
      user_id,
      description,
      amount,
      type,
      sender_id,
    });

    return response.status(201).json(statement);
  }
}

export { SendTransferController };