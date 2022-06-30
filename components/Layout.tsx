import React, { ReactNode } from 'react';
import Head from 'next/head';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div
    className="min-h-screen bg-blue-500 
    flex flex-col justify-center items-center
    text-white"
  >
    <Head>
      <title>Whac-a-NFT</title>
      <meta
        name="description"
        content="Integrate your NFTs into a play-to-earn Whac-a-Mole-like blockchain
            game and view the on-chain scores of other players."
      />
    </Head>
    {props.children}
  </div>
);

export default Layout;
