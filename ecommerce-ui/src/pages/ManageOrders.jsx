import { gql, useQuery, useMutation } from "@apollo/client";

const GET_ORDERS = gql`
  query GetAllOrders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      totalCount
      items {
        id
        totalAmount
        status
        createdAt
      }
    }
  }
`;

const UPDATE_STATUS = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

const DELETE_ORDER = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`;

export default function ManageOrders() {
  const { data, loading } = useQuery(GET_ORDERS, {
    variables: { limit: 20, offset: 0 },
    fetchPolicy: "network-only",
  });

  const [deleteOrder] = useMutation(DELETE_ORDER, {
    refetchQueries: [{ query: GET_ORDERS, variables: { limit: 20, offset: 0 } }],
  });

  const [updateStatus] = useMutation(UPDATE_STATUS, {
    refetchQueries: [{ query: GET_ORDERS, variables: { limit: 20, offset: 0 } }],
  });

  if (loading) return <p className="text-center text-gray-600 py-6">Loading...</p>;

  const orders = data?.orders?.items ?? [];

  const statusStyles = {
    pending: "bg-gray-200 text-gray-700",
    paid: "bg-yellow-200 text-yellow-800",
    shipped: "bg-blue-200 text-blue-800",
    delivered: "bg-green-200 text-green-800",
    cancelled: "bg-red-200 text-red-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">🧾 Manage Orders</h3>
        <span className="text-gray-500 text-sm">{orders.length} total orders</span>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No orders available.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div className="space-y-1">
                <p className="text-lg font-semibold text-slate-800">Order #{order.id}</p>
                <p className="text-sm text-slate-600">
                  Total Amount: <span className="font-medium text-slate-900">₹{order.totalAmount}</span>
                </p>

                <span
                  className={`inline-block px-2 py-1 text-xs rounded font-semibold ${statusStyles[order.status]}`}
                >
                  {order.status}
                </span>

                <p className="text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <select
                  className="border px-3 py-2 rounded bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm transition"
                  defaultValue={order.status}
                  onChange={(e) =>
                    updateStatus({ variables: { id: order.id, status: e.target.value } })
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {order.status === "cancelled" && (
                  <button
                    onClick={() => deleteOrder({ variables: { id: order.id } })}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm shadow"
                  >
                    Delete Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
