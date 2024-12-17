import {useEffect, useState} from "react";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import './Payment.css'

const url = `https://repick.site/api/v1/tosspayments`;

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [responseData, setResponseData] = useState(null);

  useEffect(() => {
    async function confirm() {
      const requestData = {
        orderId: searchParams.get("orderId"),
        amount: searchParams.get("amount"),
        paymentKey: searchParams.get("paymentKey"),
      };

      const response = await fetch(`${url}/confirm/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        },
        body: JSON.stringify(requestData),
      });

      const json = await response.json();

      if (!response.ok) {
        throw { message: json.message, code: json.code };
      }

      return json;
    }
if(searchParams.get("paymentKey")) {
  confirm()
      .then((data) => {
        setResponseData(data);
      })
      .catch((error) => {
        navigate(`/tosspayment/fail?code=${error.code}&message=${error.message}`);
      });
}
  }, [searchParams]);

  return (
    <div className="toss_font">
      <div className="box_section" style={{ width: "600px" }}>
        <div className="flex justify-center">
          <img width="100px" src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png" />
        </div>
        <h2 className={"text-2xl font-bold my-5"}>결제를 완료했어요</h2>
        <div className="p-grid typography--p" style={{ marginTop: "50px" }}>
          <div className="p-grid-col text--left">
            <b>결제금액</b>
          </div>
          <div className="p-grid-col text--right" id="amount">
            {`${Number(searchParams.get("amount")).toLocaleString()}원`}
          </div>
        </div>
        <div className="p-grid typography--p" style={{ marginTop: "10px" }}>
          <div className="p-grid-col text--left">
            <b>주문번호</b>
          </div>
          <div className="p-grid-col text--right" id="orderId">
            {`${searchParams.get("orderId")}`}
          </div>
        </div>
        <div className="p-grid-col">
        </div>
      </div>
      {/*<div className="box_section" style={{ width: "600px", textAlign: "left" }}>*/}
      {/*  <b>Response Data :</b>*/}
      {/*  <div id="response" style={{ whiteSpace: "initial" }}>*/}
      {/*    {responseData && <pre>{JSON.stringify(responseData, null, 4)}</pre>}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
