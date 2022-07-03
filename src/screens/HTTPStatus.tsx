export default function HTTPStatus({ code }: { code: number | string }) {
  return (
    <div className="container mx-auto flex justify-center">
      <img src={`https://http.cat/${code}`} alt={`${code}`} />
    </div>
  );
}
