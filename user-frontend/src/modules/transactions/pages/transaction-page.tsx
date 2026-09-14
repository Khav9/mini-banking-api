import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepositPage from "./deposit-page";
import WithdrawPage from "./withdraw-page";

const TransactionPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      <Tabs defaultValue="deposits" className="w-full">
        <TabsList>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdraws">Withdraws</TabsTrigger>
        </TabsList>
        <TabsContent value="deposits" className="mt-6">
          <DepositPage />
        </TabsContent>
        <TabsContent value="withdraws" className="mt-6">
          <WithdrawPage />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionPage;
