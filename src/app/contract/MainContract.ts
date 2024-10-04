import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from 'ton-core';

export type MainContractConfig = {
  number: number;
  address: Address;
  owner: Address;
};

export function mainContractConfigToCell(config: MainContractConfig): Cell {
  return beginCell()
    .storeUint(config.number, 32)
    .storeAddress(config.address)
    .storeAddress(config.owner)
    .endCell();
}

export class MainContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell }
  ) {}

  static createFromAddress(address: Address) {
    return new MainContract(address);
  }

  static createFromConfig(
    config: MainContractConfig,
    code: Cell,
    workchain = 0
  ) {
    const data = mainContractConfigToCell(config);
    const init = { code, data };
    return new MainContract(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    try {
      await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: beginCell().endCell(),
      });
    } catch (error) {
      console.error('Error in sendDeploy:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to deploy contract: ${error.message}`);
      } else {
        throw new Error('Failed to deploy contract: Unknown error');
      }
    }
  }

  async sendIncrement(
    provider: ContractProvider,
    via: Sender,
    value: bigint,
    increment_by: number
  ) {
    try {
      const msg_body = beginCell()
        .storeUint(1, 32)
        .storeUint(increment_by, 32)
        .endCell();

      await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: msg_body,
      });
    } catch (error) {
      console.error('Error in sendIncrement:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to send increment message: ${error.message}`);
      } else {
        throw new Error('Failed to send increment message: Unknown error');
      }
    }
  }

  async getData(provider: ContractProvider) {
    try {
      const { stack } = await provider.get('get_contract_storage_data', []);
      return {
        number: stack.readNumber(),
        address: stack.readAddress(),
        owner: stack.readAddress(),
      };
    } catch (error) {
      console.error('Error in getData:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to get contract data: ${error.message}`);
      } else {
        throw new Error('Failed to get contract data: Unknown error');
      }
    }
  }

  async getBalance(provider: ContractProvider) {
    try {
      const { stack } = await provider.get('balance', []);
      return {
        balance: stack.readNumber(),
      };
    } catch (error) {
      console.error('Error in getBalance:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to get balance: ${error.message}`);
      } else {
        throw new Error('Failed to get balance: Unknown error');
      }
    }
  }

  async send_deposit(provider: ContractProvider, via: Sender, value: bigint) {
    try {
      const msg_body = beginCell().storeUint(2, 32).endCell();

      await provider.internal(via, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: msg_body,
      });
    } catch (error) {
      console.error('Error in send_deposit:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to send deposit: ${error.message}`);
      } else {
        throw new Error('Failed to send deposit: Unknown error');
      }
    }
  }

  async sendWithdrawalRequest(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    amount: bigint
  ) {
    try {
      const msg_body = beginCell()
        .storeUint(3, 32) // OP code
        .storeCoins(amount)
        .endCell();

      await provider.internal(sender, {
        value,
        sendMode: SendMode.PAY_GAS_SEPARATELY,
        body: msg_body,
      });
    } catch (error) {
      console.error('Error in sendWithdrawalRequest:', error);
      if (error instanceof Error) {
        throw new Error(
          `Failed to send withdrawal request: ${error.message}`
        );
      } else {
        throw new Error('Failed to send withdrawal request: Unknown error');
      }
    }
  }
}
