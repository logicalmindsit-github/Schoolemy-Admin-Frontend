import React, { useEffect, useState ,useCallback } from "react";
import axios from "../../../Utils/api";
import styled from "styled-components";

// Styled components
const Container = styled.div`
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 1200px;
  margin: 2rem auto;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #2c3e50;
  position: relative;
  padding-bottom: 0.5rem;
  margin: 0;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3498db, #9b59b6);
    border-radius: 2px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 250px;
`;

const SearchInput = styled.input`
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 25px;
  width: 100%;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #6e8efb;
    box-shadow: 0 0 0 3px rgba(110, 142, 251, 0.1);
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  min-width: 1000px; /* Ensures table doesn't shrink too much */
`;

const TableHeader = styled.thead`
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 500;
  position: relative;
  white-space: nowrap;
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 1px;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const TableRow = styled.tr`
  transition: all 0.2s ease;
  
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  
  &:hover {
    background-color: #f1f3f5;
  }
`;

const TableCell = styled.td`
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  white-space: nowrap;
  
  &:first-child {
    font-weight: 500;
    color: #212529;
    text-align: center;
  }
`;

const SerialNumberCell = styled.td`
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #6c757d;
  text-align: center;
  font-size: 0.9em;
`;

const DateCell = styled.td`
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  font-size: 0.9em;
  white-space: nowrap;
`;

const AmountCell = styled.td`
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  white-space: nowrap;
  
  ${props => props.status === 'success' ? `
    background-color: #d4edda;
    color: #155724;
  ` : props.status === 'pending' ? `
    background-color: #fff3cd;
    color: #856404;
  ` : props.status === 'failed' ? `
    background-color: #f8d7da;
    color: #721c24;
  ` : `
    background-color: #e2e3e5;
    color: #383d41;
  `}
`;

const MethodBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  background-color: #e0f7fa;
  color: #006064;
  white-space: nowrap;
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 18px;
`;

const NoResults = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6c757d;
  font-size: 16px;
  background: white;
  border-radius: 8px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PaginationButton = styled.button`
  padding: 8px 16px;
  background-color: white;
  color: #6e8efb;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
    border-color: #6e8efb;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f8f9fa;
    color: #6c757d;
    border-color: #dee2e6;
  }
`;

const PageInfo = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

// Date formatting function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

 const fetchPayments = useCallback(async () => {
  setLoading(true);
  try {
    const res = await axios.get("/payments", {
      params: {
        page,
        limit,
        search: searchTerm,
        sortBy: "createdAt",
        order: "desc",
      },
    });
    setPayments(res.data.data);
    setTotalPages(res.data.pagination.pages);
  } catch (error) {
    console.error("Error fetching payments", error);
  } finally {
    setLoading(false);
  }
}, [page, limit, searchTerm]); // Add dependencies here

useEffect(() => {
  fetchPayments();
}, [fetchPayments]); // Now this is safe

  if (loading) return <LoadingText>Loading payments...</LoadingText>;

  return (
    <Container>
      <HeaderSection>
        <Heading>Payment Records</Heading>
        <SearchContainer>
          <SearchIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </SearchIcon>
          <SearchInput 
            type="text"
            placeholder="Search by email, mobile, reg no..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </SearchContainer>
      </HeaderSection>

      <TableWrapper>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell style={{ width: '50px' }}>#</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Reg No</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Mobile</TableHeaderCell>
              <TableHeaderCell>Course</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Method</TableHeaderCell>
              <TableHeaderCell>Txn ID</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment, index) => (
                <TableRow key={payment._id}>
                  <SerialNumberCell>{(page - 1) * limit + index + 1}</SerialNumberCell>
                  <TableCell>{payment.username}</TableCell>
                  <TableCell>{payment.studentRegisterNumber}</TableCell>
                  <TableCell>{payment.email}</TableCell>
                  <TableCell>{payment.mobile}</TableCell>
                  <TableCell>{payment.courseName}</TableCell>
                  <AmountCell>₹{payment.amount.toFixed(2)}</AmountCell>
                  <TableCell>
                    <StatusBadge status={payment.paymentStatus?.toLowerCase()}>
                      {payment.paymentStatus}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    <MethodBadge>{payment.paymentMethod}</MethodBadge>
                  </TableCell>
                  <TableCell>{payment.transactionId}</TableCell>
                  <DateCell>{formatDate(payment.createdAt)}</DateCell>
                </TableRow>
              ))
            ) : (
              <tr>
                <td colSpan="11">
                  <NoResults>No payments found matching your search criteria</NoResults>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </TableWrapper>

      <PaginationContainer>
        <PaginationButton
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </PaginationButton>
        <PageInfo>
          Page {page} of {totalPages}
        </PageInfo>
        <PaginationButton
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </PaginationButton>
      </PaginationContainer>
    </Container>
  );
};

export default AllPayments;