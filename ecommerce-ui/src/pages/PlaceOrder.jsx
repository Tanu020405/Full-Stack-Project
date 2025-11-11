import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useParams, useNavigate } from "react-router-dom";

const PLACE_ORDER = gql`
  mutation PlaceOrder($items: [OrderItemInput!]!) {
    placeOrder(items: $items) {
      id
    }
  }
`;

export default function PlaceOrder() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const [placeOrder, { loading, error }] = useMutation(PLACE_ORDER, {
    refetchQueries: ["GetMyOrders"],
  });

  const handleOrder = async () => {
    await placeOrder({ variables: { items: [{ productId, quantity }] } });
    navigate("/orders");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-lg">
        <h2 className="text-xl font-bold text-slate-700 mb-4">Place Order</h2>

        <label className="text-slate-700">Quantity</label>
        <input
          type="number"
          min="1"
          className="border border-slate-300 rounded px-3 py-2 w-full mb-4"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />

        <button
          onClick={handleOrder}
          className="bg-slate-600 hover:bg-slate-700 text-white w-full py-2 rounded"
        >
          {loading ? "Placing..." : "Confirm Order"}
        </button>

        {error && <p className="text-red-500 mt-3">{error.message}</p>}
      </div>
    </div>
  );
}
