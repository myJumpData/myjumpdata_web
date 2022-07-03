import { useParams } from "react-router-dom";
import HTTPStatus from "./HTTPStatus";

export default function ErrorScreen() {
  const params = useParams();
  return <HTTPStatus code={params?.code || "000"} />;
}
