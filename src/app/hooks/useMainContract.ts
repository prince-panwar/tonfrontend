import { useEffect, useState } from "react";
import { MainContract } from "../contract/MainContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";




export function useMainContract() {
    const client = useTonClient();
    const {sender} = useTonConnect();
    const [contractData, setContractData] = useState<null | {
      counter_value: number;
      recent_sender: Address;
      owner_address: Address;
      contract_balance: number;
    }>();
  
    const mainContract = useAsyncInitialize(async () => {
      if (!client) return;
      const contract = new MainContract(
        Address.parse("EQABibbrtqLJ-hg0IeDOnU3nFBWCpaDdzOmoh3fuWqxw831A") // replace with your address from tutorial 2 step 8
      );
      return client.open(contract) as OpenedContract<MainContract>;
    }, [client]);

    async function getValue() {
        if (!mainContract) return;
        setContractData(null);
        const val = await mainContract.getData();
        const balance = await mainContract.getBalance();
        setContractData({
          counter_value: val.number,
          recent_sender: val.address,
          owner_address: val.owner,
          contract_balance: balance.balance,
        });
    }
    useEffect(() => {
     getValue();
    }, [mainContract]);
  
    const sendIncrement = async () => {
        if (!mainContract) return;
        try{
        await mainContract.sendIncrement(sender, toNano(0.05), 1);
        getValue();    
    }catch(e){
          console.log(e);
        }
    }
    const sendDeposit = async (value: number) => {
        if (!mainContract) return;
        try{
        await mainContract.send_deposit(sender, toNano(value));
       getValue();   
    }catch(e){
          console.log(e);
        }
    }

    const sendWithdraw = async (value:number) => {
        if (!mainContract) return;
        try{
        await mainContract.sendWithdrawalRequest(sender, toNano(0.05),toNano(value));
        }catch(e){
          console.log(e);
        }finally{
            getValue()
    }
}
    
    
    return {
      contract_address: mainContract?.address.toString(),
      ...contractData,
      sendIncrement,
      sendDeposit,
      sendWithdraw
    };
  }
