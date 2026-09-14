import "./CustomersList.css";

const CustomersList = ({ customers, onToggleStatus, onEditClick }) => {
  return (
    <div className="customer-list-section">
      <h3>Customer List</h3>
      <div className="table-responsive">
        <table className="customer-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>State</th>
              <th>Address</th>
              <th>Phone No</th>
              <th>SR Name</th>
              <th>Action (Edit / Status)</th>
            </tr>
          </thead>
          <tbody>
            {customers.length > 0 ? (
              customers.map((cust) => {
                const currentStatus = cust.status
                  ? cust.status.toLowerCase()
                  : "active";
                return (
                  <tr key={cust.customerId}>
                    <td>
                      <strong>{cust.customerId}</strong>
                    </td>
                    <td>{cust.customerName}</td>
                    <td>{cust.state}</td>
                    <td>{cust.address}</td>
                    <td>{cust.phoneNo}</td>
                    <td>{cust.srName}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        {/* Edit Icon Button */}
                        <button
                          type="button"
                          onClick={() => onEditClick(cust)}
                          title="Edit Customer"
                          style={{
                            background: "#e0f2fe",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {/* Pencil SVG Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#0284c7"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>

                        {/* Active / Inactive Toggle Button */}
                        <button
                          type="button"
                          className={`status-badge-btn ${currentStatus}`}
                          onClick={() =>
                            onToggleStatus(cust.customerId, currentStatus)
                          }
                          style={{
                            cursor: "pointer",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            width: "100px"
                          }}
                        >
                          {currentStatus === "active" ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersList;
