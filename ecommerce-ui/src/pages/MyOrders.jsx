import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";

const GET_MY_ORDERS = gql`
  query GetMyOrders {
    orders {
      items {
        id
        totalAmount
        status
        createdAt
        items {
          quantity
          product {
            name
          }
        }
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation CancelOrder($id: ID!) {
    cancelMyOrder(id: $id) {
      id
      status
    }
  }
`;

const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteMyOrder(id: $id)
  }
`;

export default function MyOrders() {
  const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS, {
    fetchPolicy: "network-only",
  });

  const [cancelOrder] = useMutation(CANCEL_ORDER, { refetchQueries: ["GetMyOrders"] });
  const [deleteOrder] = useMutation(DELETE_ORDER, { refetchQueries: ["GetMyOrders"] });

  const [confirmAction, setConfirmAction] = useState(null);

  if (loading) return <p className="p-6 text-slate-600">Loading orders...</p>;
  if (error) return <p className="p-6 text-red-600">{error.message}</p>;

  const orders = data?.orders?.items ?? [];

  const statusStyles = {
    pending: "bg-yellow-200 text-yellow-800",
    paid: "bg-blue-200 text-blue-800",
    shipped: "bg-purple-200 text-purple-800",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-red-200 text-red-800",
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-slate-900 mb-6">My Orders</h2>

      {orders.length === 0 && (
        <p className="text-slate-600 text-center bg-white p-6 rounded shadow-sm">
          You haven't placed any orders yet.
        </p>
      )}

      {orders.map((order) => (
        <div key={order.id} className="bg-white border border-slate-200 shadow-sm rounded-lg p-5 mb-5">
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-medium text-slate-800">₹{order.totalAmount}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold ${statusStyles[order.status]}`}>
              {order.status}
            </span>
          </div>

          <ul className="text-slate-700 text-sm pl-5 list-disc mb-3">
            {order.items.map((i, index) => (
              <li key={index}>
                {i.quantity} × {i.product?.name || <i>Product unavailable</i>}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 mt-3">
            {order.status === "pending" && (
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                onClick={() => setConfirmAction({ type: "cancel", order })}
              >
                Cancel Order
              </button>
            )}

            {(order.status === "cancelled" || order.items.some(i => !i.product)) && (
              <button
                className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
                onClick={() => setConfirmAction({ type: "delete", order })}
              >
                Delete Order
              </button>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-3">
            Ordered on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      ))}

      {/* Confirmation Popup */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-80 animate-fadeIn">
            <h3 className="font-semibold text-lg text-slate-800 mb-4">
              {confirmAction.type === "cancel"
                ? "Cancel this order?"
                : "Delete this order permanently?"}
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-1 bg-gray-300 hover:bg-gray-400 rounded"
                onClick={() => setConfirmAction(null)}
              >
                No
              </button>
              <button
                className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                onClick={() => {
                  confirmAction.type === "cancel"
                    ? cancelOrder({ variables: { id: confirmAction.order.id } })
                    : deleteOrder({ variables: { id: confirmAction.order.id } });
                  setConfirmAction(null);
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
