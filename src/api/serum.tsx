import { Account, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Market } from "@project-serum/serum";

class SerumMarketOperations {
  private connection: Connection;
  private market: Market | null;
  private owner: Keypair;

  constructor(connection: Connection, owner: Keypair) {
    this.connection = connection;
    this.owner = owner;
    this.market = null;
  }

  async initialize(
    marketAddress: string,
    programAddress: string
  ): Promise<void> {
    try {
      this.market = await Market.load(
        this.connection,
        new PublicKey(marketAddress),
        {},
        new PublicKey(programAddress)
      );
      console.log(`Market ${this.market.address.toBase58()} initialized.`);
    } catch (error) {
      console.error("Error initializing market:", error);
      throw error;
    }
  }

  private ensureMarketInitialized(): void {
    if (!this.market) {
      throw new Error("Market not initialized. Call initialize() first.");
    }
  }

  async getOrderbook(depth: number = 20) {
    this.ensureMarketInitialized();
    try {
      const [bids, asks] = await Promise.all([
        this.market!.loadBids(this.connection),
        this.market!.loadAsks(this.connection),
      ]);

      return {
        bids: bids.getL2(depth),
        asks: asks.getL2(depth),
      };
    } catch (error) {
      console.error("Error fetching orderbook:", error);
      throw error;
    }
  }

  async placeOrder(params: {
    payer: PublicKey;
    side: "buy" | "sell";
    price: number;
    size: number;
    orderType: "limit" | "ioc" | "postOnly";
  }) {
    this.ensureMarketInitialized();
    try {
      await this.market!.placeOrder(this.connection, {
        owner: new Account(this.owner.secretKey),
        ...params,
      });
      console.log(
        `Order placed: ${params.side} ${params.size} @ ${params.price}`
      );
    } catch (error) {
      console.error("Error placing order:", error);
      throw error;
    }
  }

  async getOpenOrders() {
    this.ensureMarketInitialized();
    try {
      return await this.market!.loadOrdersForOwner(
        this.connection,
        this.owner.publicKey
      );
    } catch (error) {
      console.error("Error fetching open orders:", error);
      throw error;
    }
  }

  async cancelAllOrders() {
    this.ensureMarketInitialized();
    try {
      const orders = await this.getOpenOrders();
      for (let order of orders) {
        await this.market!.cancelOrder(
          this.connection,
          new Account(this.owner.secretKey),
          order
        );
      }
      console.log("All orders cancelled");
    } catch (error) {
      console.error("Error cancelling orders:", error);
      throw error;
    }
  }

  async getFills() {
    this.ensureMarketInitialized();
    try {
      return await this.market!.loadFills(this.connection);
    } catch (error) {
      console.error("Error fetching fills:", error);
      throw error;
    }
  }

  async settleFunds(baseTokenAccount: PublicKey, quoteTokenAccount: PublicKey) {
    this.ensureMarketInitialized();
    try {
      const openOrdersAccounts =
        await this.market!.findOpenOrdersAccountsForOwner(
          this.connection,
          this.owner.publicKey
        );

      for (let openOrders of openOrdersAccounts) {
        if (openOrders.baseTokenFree > 0 || openOrders.quoteTokenFree > 0) {
          await this.market!.settleFunds(
            this.connection,
            new Account(this.owner.secretKey),
            openOrders,
            baseTokenAccount,
            quoteTokenAccount
          );
        }
      }
      console.log("Funds settled");
    } catch (error) {
      console.error("Error settling funds:", error);
      throw error;
    }
  }
}

export default SerumMarketOperations;
