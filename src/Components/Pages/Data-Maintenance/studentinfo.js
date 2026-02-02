import React, { useEffect, useState } from "react";
import axios from "../../../Utils/api";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// Styled components
const PageWrapper = styled.div`
  padding: 2rem;
`;

const BackButton = styled.button`
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Container = styled.div`
  padding: 2rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 1400px;
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

const StatsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex: 1;
  min-width: 150px;
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #6c757d;
  margin-bottom: 0.5rem;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
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

const UserGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const UserCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f8f9fa;
`;

const Avatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
`;

const UserBasicInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
`;

const UserEmail = styled.p`
  margin: 0;
  color: #6c757d;
  font-size: 14px;
`;

const UserDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
  width: fit-content;

  ${props => props.status === 'active' ? `
    background-color: #d4edda;
    color: #155724;
  ` : props.status === 'inactive' ? `
    background-color: #f8d7da;
    color: #721c24;
  ` : props.status === 'logged-out' ? `
    background-color: #fff3cd;
    color: #856404;
  ` : `
    background-color: #e2e3e5;
    color: #383d41;
  `}
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
  grid-column: 1 / -1;
`;

// Date formatting function
const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

const StudentInfo = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    maleCount: 0,
    femaleCount: 0,
    activeCount: 0,
    inactiveCount: 0
  });

  const calculateStats = (users) => {
    const totalUsers = users.length;
    const maleCount = users.filter(user => user.gender?.toLowerCase() === 'male').length;
    const femaleCount = users.filter(user => user.gender?.toLowerCase() === 'female').length;
    const activeCount = users.filter(user => user.status?.toLowerCase() === 'active').length;
    const inactiveCount = users.filter(user => user.status?.toLowerCase() === 'inactive').length;

    return {
      totalUsers,
      maleCount,
      femaleCount,
      activeCount,
      inactiveCount
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/payments");
      const paymentData = response.data.data;
      
      // Group payments by user and collect their course categories
      const userMap = new Map();
      
      paymentData.forEach(payment => {
        const user = payment.userId;
        const category = payment.courseId?.category;
        
        if (user && category) {
          if (!userMap.has(user._id)) {
            userMap.set(user._id, {
              ...user,
              purchasedCategories: new Set(),
              courseCategories: []
            });
          }
          
          const userData = userMap.get(user._id);
          if (!userData.purchasedCategories.has(category)) {
            userData.purchasedCategories.add(category);
            userData.courseCategories.push(category);
          }
        }
      });
      
      // Convert to array and calculate stats
      const usersWithCategories = Array.from(userMap.values()).map(user => ({
        ...user,
        purchasedCategories: undefined, // Remove the Set
        courseCategories: user.courseCategories
      }));
      
      setUsers(usersWithCategories);
      setFilteredUsers(usersWithCategories);
      setStats(calculateStats(usersWithCategories));
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        Object.values(user).some(
          value => value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        (user.courseCategories && user.courseCategories.some(category =>
          category.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) return <LoadingText>Loading student purchase information...</LoadingText>;

  return (
    <PageWrapper>
      <BackButton onClick={() => navigate(-1)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </BackButton>
      <Container>
        <HeaderSection>
          <Heading>Student Purchase Information</Heading>
          <SearchContainer>
            <SearchIcon>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search students by name, email, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </HeaderSection>

        <StatsContainer>
          <StatCard>
            <StatTitle>Total Students</StatTitle>
            <StatValue>{stats.totalUsers}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Male Students</StatTitle>
            <StatValue>{stats.maleCount}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Female Students</StatTitle>
            <StatValue>{stats.femaleCount}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Active Students</StatTitle>
            <StatValue>{stats.activeCount}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Inactive Students</StatTitle>
            <StatValue>{stats.inactiveCount}</StatValue>
          </StatCard>
        </StatsContainer>

        <UserGrid>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user._id}>
                <UserHeader>
                  <Avatar>
                    {getInitials(user.username)}
                  </Avatar>
                  <UserBasicInfo>
                    <UserName>{user.username || "N/A"}</UserName>
                    <UserEmail>{user.email || "N/A"}</UserEmail>
                  </UserBasicInfo>
                </UserHeader>

                <UserDetails>
                  <DetailItem>
                    <DetailLabel>Reg Number</DetailLabel>
                    <DetailValue>{user.studentRegisterNumber || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Mobile</DetailLabel>
                    <DetailValue>{user.mobile || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Gender</DetailLabel>
                    <DetailValue>{user.gender || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Date of Birth</DetailLabel>
                    <DetailValue>{formatDate(user.dateofBirth)}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Father Name</DetailLabel>
                    <DetailValue>{user.fatherName || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Blood Group</DetailLabel>
                    <DetailValue>{user.bloodGroup || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Nationality</DetailLabel>
                    <DetailValue>{user.Nationality || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Occupation</DetailLabel>
                    <DetailValue>{user.Occupation || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Address</DetailLabel>
                    <DetailValue>
                      {user.address ? `${user.address.city || ""}, ${user.address.state || ""}`.replace(/^, |, $/, "") || "N/A" : "N/A"}
                    </DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Status</DetailLabel>
                    <StatusBadge status={user.status?.toLowerCase()}>
                      {user.status || "N/A"}
                    </StatusBadge>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Role</DetailLabel>
                    <DetailValue>{user.role || "N/A"}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Purchased Course Categories</DetailLabel>
                    <DetailValue>
                      {user.courseCategories && user.courseCategories.length > 0 
                        ? user.courseCategories.join(", ")
                        : "No purchases"}
                    </DetailValue>
                  </DetailItem>
                </UserDetails>
              </UserCard>
            ))
          ) : (
            <NoResults>No students found with purchases matching your search criteria</NoResults>
          )}
        </UserGrid>
      </Container>
    </PageWrapper>
  );
};

export default StudentInfo;