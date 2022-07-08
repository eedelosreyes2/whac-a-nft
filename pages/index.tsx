import { useEffect, useState } from 'react';
import { useMoralis, useMoralisSolanaApi } from 'react-moralis';
import Game from '../components/Game';
import Layout from '../components/Layout';

const NETWORK = 'mainnet'; // devnet

export default function Home() {
  const { isAuthenticated, authenticate, user, logout } = useMoralis();
  const { SolanaAPI } = useMoralisSolanaApi();
  const [address, setAddress] = useState('');
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      setAddress(user.attributes.solAddress);
      getNfts();
    }
  }, [isAuthenticated]);

  const getNfts = async () => {
    try {
      const nftAddresses = await SolanaAPI.account.getNFTs({
        network: NETWORK,
        address: address || user.attributes.solAddress,
      });

      nftAddresses.map(async ({ mint }) => {
        await SolanaAPI.nft
          .getNFTMetadata({
            address: mint,
            network: NETWORK,
          })
          .then((data) => {
            const { name, metaplex } = data;

            fetch(metaplex.metadataUri)
              .then((response) => response.json())
              .then(({ image }) => {
                let index = nfts.findIndex((nft) => nft.mint === mint);
                if (index < 0) {
                  setNfts((nft) => nft.concat({ mint, name, image }));
                }
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => console.log(err));
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Layout>
      <Game
        isAuthenticated={isAuthenticated}
        authenticate={authenticate}
        logout={logout}
        address={address}
        nfts={nfts}
      />
    </Layout>
  );
}
