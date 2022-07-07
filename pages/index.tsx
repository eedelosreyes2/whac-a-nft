import { useEffect, useState } from 'react';
import { useMoralis, useMoralisSolanaApi } from 'react-moralis';
import Game from '../components/Game';
import Layout from '../components/Layout';

const NETWORK = 'mainnet'; // devnet

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const { isAuthenticated, authenticate, user, logout } = useMoralis();
  const { SolanaAPI } = useMoralisSolanaApi();

  useEffect(() => {
    if (isAuthenticated) {
      getNfts();
    }
  }, [isAuthenticated]);

  const getNfts = async () => {
    try {
      const nftAddresses = await SolanaAPI.account.getNFTs({
        network: NETWORK,
        address: user.attributes.solAddress,
      });

      nftAddresses.map(async (address) => {
        const nftResult = await SolanaAPI.nft.getNFTMetadata({
          network: NETWORK,
          address: address.mint,
        });
        console.log(nftResult);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <Game
        isAuthenticated={isAuthenticated}
        authenticate={authenticate}
        user={user}
        logout={logout}
      />
    </Layout>
  );
}
