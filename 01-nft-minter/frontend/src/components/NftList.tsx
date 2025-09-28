export function NftList() {
  const nfts: {
    photoUrl: string;
    name: string;
  }[] = [
    {
      photoUrl:
        "https://imgs.search.brave.com/w1uwMJMIrXocUzDrw3h9NHyaUnhcy52ppflGKfeFcZA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudW5zcGxhc2gu/Y29tL3Bob3RvLTE1/NzAxMzg3NDQ3NzEt/NTViYTFmM2M3NDNk/P2ZtPWpwZyZxPTYw/Jnc9MzAwMCZpeGxp/Yj1yYi00LjEuMCZp/eGlkPU0zd3hNakEz/ZkRCOE1IeHpaV0Z5/WTJoOE5IeDhjMjFo/Ykd3bE1qQjBiM2R1/ZkdWdWZEQjhmREI4/Zkh3dw",
      name: "Small town. Bricks. Beautiful town",
    },
    {
      photoUrl:
        "https://imgs.search.brave.com/xibCr9QAKky8jpywPPRA2rzHx_lsX7fNvJJc8LRBgd0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzIxLzg2Lzgy/LzM2MF9GXzEyMTg2/ODI1OF9SOXlrRmRD/Mzhtbk91aTc0ZXlt/QWs4N1dSb2lDZ21I/eC5qcGc",
      name: "Pretty town. Nft on Sui",
    },
  ];

  if (!nfts.length) return <div>You haven't minted any NFTs yet 😔</div>;

  return (
    <div className="w-full gap-2 grid grid-cols-2 sm:grid-cols-4">
      {nfts.map((nft, index) => (
        <NftListItem key={index} src={nft} />
      ))}
    </div>
  );
}

type NftListItemProps = {
  src: { photoUrl: string; name: string };
};

function NftListItem({ src }: NftListItemProps) {
  return (
    <div className="rounded-md flex flex-col overflow-hidden border w-full">
      <img src={src.photoUrl} className="w-full object-cover aspect-square" />
      <div className="px-3 py-2 wrap-normal">{src.name}</div>
    </div>
  );
}
