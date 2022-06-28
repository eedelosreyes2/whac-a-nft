import React, { ReactNode } from 'react';
import Head from 'next/head';

type Props = {
  children: ReactNode;
};

const Layout: React.FC<Props> = (props) => (
  <div
    className="min-h-screen bg-slate-900 
    flex flex-col justify-center items-center
    text-white"
  >
    <Head>
      <title>Whac-A-NFT</title>
      <meta
        name="description"
        content="Integrate your NFTs into a play-to-earn Whac-a-Mole-like blockchain
            game and view the on-chain scores of other players."
      />
    </Head>
    <div>{props.children}</div>
  </div>
);

export default Layout;
