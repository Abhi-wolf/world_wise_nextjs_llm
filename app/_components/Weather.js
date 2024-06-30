export async function Weather({ city, unit }) {
  const data = await fetch(
    `https://api.example.com/weather?city=${city}&unit=${unit}`
  );

  console.log(data);

  return (
    <div>
      <div>{data.temperature}</div>
      <div>{data.unit}</div>
      <div>{data.description}</div>
    </div>
  );
}
