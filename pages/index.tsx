import Head from 'next/head';

export default function Home() {
  const renderHeader = () => {
    return (
      <>
        <Head>
          <title>Whac-A-NFT</title>
          <meta
            name="description"
            content="Integrate your NFTs into a play-to-earn Whac-a-Mole-like blockchain
            game and view the on-chain scores of other players."
          />
        </Head>
      </>
    );
  };

  return (
    <div
      className="min-h-screen bg-slate-900 
        flex flex-col justify-center items-center
        text-white"
    >
      {renderHeader()}
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  );
}
