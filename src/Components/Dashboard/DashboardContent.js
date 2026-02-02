import React from "react";
import { Card, Row, Col, Typography, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import {
  UserOutlined,
  BookOutlined,
  DollarCircleOutlined,
  StarFilled,
} from "@ant-design/icons";
import logo from "../../assets/logo.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

const { Title, Text, Paragraph } = Typography;

// Sample data for the charts
const emiData = [
  { month: "Jan", EMI: 40, Paid: 30 },
  { month: "Feb", EMI: 45, Paid: 35 },
  { month: "Mar", EMI: 50, Paid: 40 },
  { month: "Apr", EMI: 42, Paid: 38 },
  { month: "May", EMI: 48, Paid: 45 },
  { month: "Jun", EMI: 52, Paid: 49 },
];

const enrollmentsData = [
  { month: "Jan", enrollments: 120 },
  { month: "Feb", enrollments: 150 },
  { month: "Mar", enrollments: 160 },
  { month: "Apr", enrollments: 140 },
  { month: "May", enrollments: 175 },
  { month: "Jun", enrollments: 190 },
];

const DashboardContent = ({
  totalUsers = 1520,
  totalCourses = 78,
  activeSubscriptions = 1245,
  completionRate = 86,
}) => {
  const navigate = useNavigate();
  // Styles
  const styles = {
    container: {
      padding: "24px",
      background: "#f8fafc",
      minHeight: "100vh",
    },
    contentWrapper: {
      maxWidth: "1400px",
      margin: "0 auto",
    },
    card: {
      marginBottom: "24px",
      border: "1px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.02)",
      background: "white",
    },
    cardHeader: {
      borderBottom: "1px solid #e2e8f0",
      padding: "16px 24px",
      background: "linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)",
      borderRadius: "12px 12px 0 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardTitle: {
      color: "white",
      margin: 0,
      fontWeight: 600,
    },
    cardBody: {
      padding: "24px",
    },
    statCard: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "16px",
      height: "100%",
      transition: "all 0.3s ease",
      ":hover": {
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
        transform: "translateY(-2px)",
      },
    },
    clickableStatCard: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
      background: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "16px",
      height: "100%",
      transition: "all 0.3s ease",
      cursor: "pointer",
      ":hover": {
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
        transform: "translateY(-2px)",
        borderColor: "#3b82f6",
      },
    },
    avatar: {
      backgroundColor: "#eff6ff",
      color: "#1e40af",
      fontSize: "24px",
    },
    statText: {
      color: "#1e293b",
      fontSize: "14px",
      fontWeight: 500,
    },
    statValue: {
      color: "#1e40af",
      fontSize: "20px",
      fontWeight: 600,
      marginTop: "4px",
    },
    chartTitle: {
      color: "#1e293b",
      fontSize: "16px",
      fontWeight: 600,
      marginBottom: "16px",
    },
    instructorCard: {
      textAlign: "center",
      border: "1px solid #e2e8f0",
      background: "white",
      borderRadius: "8px",
      padding: "16px",
      height: "100%",
      transition: "all 0.3s ease",
      ":hover": {
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
      },
    },
    courseCard: {
      border: "1px solid #e2e8f0",
      background: "white",
      borderRadius: "8px",
      height: "100%",
      transition: "all 0.3s ease",
      ":hover": {
        boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
      },
    },
    testimonialCard: {
      height: "100%",
      border: "1px solid #e2e8f0",
      background: "white",
      borderRadius: "8px",
      padding: "16px",
    },
    testimonialQuote: {
      padding: "16px",
      background: "#f8fafc",
      borderRadius: "8px",
      marginBottom: "16px",
      borderLeft: "4px solid #3b82f6",
    },
    sectionTitle: {
      color: "#1e40af",
      marginBottom: "24px",
      fontWeight: 600,
    },
    blueText: {
      color: "#1e40af",
    },
    lightBlueBg: {
      background: "#eff6ff",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.contentWrapper}>
        {/* About Section */}
        <Card
          headStyle={styles.cardHeader}
          bodyStyle={styles.cardBody}
          style={styles.card}
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Title level={2} style={styles.cardTitle}>
                Schoolemy Admin Dashboard
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={logo}
                  alt="Schoolemy Logo"
                  style={{
                    height: "30px",
                    width: "auto",
                    maxWidth: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          }
        >
          <Paragraph style={{ fontSize: "16px", color: "#475569" }}>
            <Text strong style={styles.blueText}>
              Schoolemy
            </Text>{" "}
            is a comprehensive LMS designed to bring ancient wisdom to modern
            learners through cutting-edge technology.
          </Paragraph>

          {/* Stats Section */}
          <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
            {[
              {
                title: "Total Users",
                count: totalUsers.toLocaleString(),
                icon: <UserOutlined />,
                trend: "+12% this month",
                clickable: true,
                path: "/schoolemy/user-details",
              },
              {
                title: "Total Courses",
                count: totalCourses.toString(),
                icon: <BookOutlined />,
                trend: "+5 new courses",
                clickable: true,
                path: "/schoolemy/course-list",
              },
              {
                title: "Active Subscriptions",
                count: activeSubscriptions.toLocaleString(),
                icon: <DollarCircleOutlined />,
                trend: "92% renewal rate",
                clickable: false,
              },
              {
                title: "Completion Rate",
                count: `${completionRate}%`,
                icon: <StarFilled />,
                trend: "3% improvement",
                clickable: false,
              },
            ].map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div
                  style={
                    stat.clickable ? styles.clickableStatCard : styles.statCard
                  }
                  onClick={
                    stat.clickable ? () => navigate(stat.path) : undefined
                  }
                  title={
                    stat.clickable
                      ? `Click to view ${stat.title.toLowerCase()}`
                      : undefined
                  }
                >
                  <Avatar icon={stat.icon} size={48} style={styles.avatar} />
                  <div>
                    <Text style={styles.statText}>{stat.title}</Text>
                    <div style={styles.statValue}>{stat.count}</div>
                    <Text style={{ color: "#64748b", fontSize: "12px" }}>
                      {stat.trend}
                    </Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Charts Section */}
        <Card
          headStyle={styles.cardHeader}
          bodyStyle={styles.cardBody}
          style={styles.card}
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Title level={3} style={styles.cardTitle}>
                Performance Analytics
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={logo}
                  alt="Schoolemy Logo"
                  style={{
                    height: "30px",
                    width: "auto",
                    maxWidth: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          }
        >
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <div style={styles.chartTitle}>Monthly EMI vs Paid</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={emiData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="EMI"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    name="EMI Due"
                  />
                  <Bar
                    dataKey="Paid"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    name="Amount Paid"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Col>

            <Col xs={24} md={12}>
              <div style={styles.chartTitle}>Course Enrollments Trend</div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={enrollmentsData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#1e40af", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#1e40af" }}
                    name="Enrollments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </Card>

        {/* Instructors Section */}
        <Card
          headStyle={styles.cardHeader}
          bodyStyle={styles.cardBody}
          style={{
            ...styles.card,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Title level={3} style={styles.cardTitle}>
                Our Esteemed Instructors
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={logo}
                  alt="Schoolemy Logo"
                  style={{
                    height: "30px",
                    width: "auto",
                    maxWidth: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          }
          onClick={() => navigate("/schoolemy/institutional-board")}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(59, 130, 246, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.02)";
          }}
          hoverable
        >
          <Paragraph style={{ color: "#475569", marginBottom: "24px" }}>
            Schoolemy works with <Text strong>certified experts</Text> in each
            discipline to ensure authentic knowledge transmission.
          </Paragraph>

          <Row gutter={[16, 16]}>
            {[
              {
                name: "Mr. Adubakar Siddique",
                expertise: "Ayurveda Specialist",
                exp: "15+ years experience",
                students: "2,400+ students",
              },
              {
                name: "Mr. Rajarajeshwari",
                expertise: "Siddha Medicine",
                exp: "25+ years experience",
                students: "3,100+ students",
              },
              {
                name: "Vaidya Rajan",
                expertise: "Kundalini Yoga Master ",
                exp: "20+ years experience",
                students: "1,800+ students",
              },
              {
                name: "Swami Atmananda",
                expertise: "Meditation & Philosophy",
                exp: "30+ years experience",
                students: "4,200+ students",
              },
            ].map((instructor, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div style={styles.instructorCard}>
                  <Avatar
                    size={80}
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: "#eff6ff",
                      color: "#1e40af",
                      margin: "0 auto 16px",
                    }}
                  />
                  <Title
                    level={4}
                    style={{ color: "#1e40af", marginBottom: "8px" }}
                  >
                    {instructor.name}
                  </Title>
                  <Text strong style={{ color: "#1e293b", display: "block" }}>
                    {instructor.expertise}
                  </Text>
                  <Text
                    style={{
                      color: "#64748b",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {instructor.exp}
                  </Text>
                  <Text
                    style={{
                      color: "#3b82f6",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {instructor.students}
                  </Text>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Courses Section */}
        <Card
          headStyle={styles.cardHeader}
          bodyStyle={styles.cardBody}
          style={{
            ...styles.card,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Title level={3} style={styles.cardTitle}>
                Our Course Offerings
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={logo}
                  alt="Schoolemy Logo"
                  style={{
                    height: "30px",
                    width: "auto",
                    maxWidth: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          }
          onClick={() => navigate("/schoolemy/courses")}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(59, 130, 246, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.02)";
          }}
          hoverable
        >
          <Row gutter={[16, 16]}>
            {[
              {
                title: "Yoga Courses",
                types: [
                  "Hatha Yoga Certification",
                  "Ashtanga Yoga Mastery",
                  "Yoga Therapy",
                  "Prenatal Yoga",
                  "Yoga for Stress Management",
                ],
                icon: "🧘",
                count: "24 courses",
              },
              {
                title: "Siddha Courses",
                types: [
                  "Fundamentals of Siddha Medicine",
                  "Siddha Nutrition",
                  "Siddha Pharmacology",
                  "Siddha Diagnosis Techniques",
                  "Advanced Siddha Practices",
                ],
                icon: "🌿",
                count: "18 courses",
              },
              {
                title: "Ayurveda Courses",
                types: [
                  "Ayurvedic Lifestyle",
                  "Panchakarma Therapy",
                  "Ayurvedic Nutrition",
                  "Herbal Medicine",
                  "Ayurvedic Beauty Treatments",
                ],
                icon: "💆",
                count: "22 courses",
              },
              {
                title: "Special Programs",
                types: [
                  "Yoga & Ayurveda Integration",
                  "Meditation Retreats",
                  "Teacher Training",
                  "Corporate Wellness",
                  "Customized Learning Paths",
                ],
                icon: "✨",
                count: "14 courses",
              },
            ].map((course, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div style={styles.courseCard}>
                  <div
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <span style={{ fontSize: "24px" }}>{course.icon}</span>
                    <div>
                      <Text
                        strong
                        style={{ color: "#1e40af", fontSize: "16px" }}
                      >
                        {course.title}
                      </Text>
                      <Text
                        style={{
                          color: "#64748b",
                          fontSize: "12px",
                          display: "block",
                        }}
                      >
                        {course.count}
                      </Text>
                    </div>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <ul
                      style={{
                        paddingLeft: "20px",
                        color: "#475569",
                        margin: 0,
                      }}
                    >
                      {course.types.map((type, i) => (
                        <li
                          key={i}
                          style={{ marginBottom: "8px", fontSize: "14px" }}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Testimonials Section */}
        <Card
          headStyle={styles.cardHeader}
          bodyStyle={styles.cardBody}
          style={{
            ...styles.card,
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          title={
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
              <Title level={3} style={styles.cardTitle}>
                What Our Students Say
              </Title>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={logo}
                  alt="Schoolemy Logo"
                  style={{
                    height: "30px",
                    width: "auto",
                    maxWidth: "100px",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>
          }
          onClick={() => navigate("/schoolemy/feedback")}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 8px 25px rgba(59, 130, 246, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.02)";
          }}
          hoverable
        >
          <Row gutter={[16, 16]}>
            {[
              {
                quote:
                  "Schoolemy transformed my understanding of Ayurveda. The courses are comprehensive and authentic.",
                author: "Dr. Ananya Patel, Medical Practitioner",
                rating: "5.0",
              },
              {
                quote:
                  "The Siddha medicine course gave me practical knowledge I use daily in my practice.",
                author: "Vaidya Karthik, Traditional Healer",
                rating: "4.5",
              },
              {
                quote:
                  "As a yoga teacher, the advanced certifications elevated my skills and credibility.",
                author: "Yogini Meera, Yoga Instructor",
                rating: "5.0",
              },
              {
                quote:
                  "The integration of technology with traditional knowledge is revolutionary.",
                author: "Prof. Rajiv Menon, Educationist",
                rating: "5.0",
              },
            ].map((testimonial, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div style={styles.testimonialCard}>
                  <div style={styles.testimonialQuote}>
                    <Text
                      style={{
                        fontSize: "14px",
                        fontStyle: "italic",
                        color: "#475569",
                      }}
                    >
                      "{testimonial.quote}"
                    </Text>
                  </div>
                  <Text strong style={{ color: "#1e293b" }}>
                    {testimonial.author}
                  </Text>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: "4px",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <StarFilled
                        key={i}
                        style={{
                          color:
                            i < Math.floor(parseFloat(testimonial.rating))
                              ? "#f59e0b"
                              : "#cbd5e1",
                          fontSize: "14px",
                          marginRight: "2px",
                        }}
                      />
                    ))}
                    <Text
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                        marginLeft: "4px",
                      }}
                    >
                      {testimonial.rating}
                    </Text>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default DashboardContent;
