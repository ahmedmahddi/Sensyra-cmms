# Sensyra CMMS - Project Overview

## 🎯 Project Vision

Build a localized, affordable CMMS (Computerized Maintenance Management System) specifically designed for the Tunisian market, targeting SMBs initially and expanding to enterprises. This system will compete with international solutions like MaintainX by offering local advantages: Arabic/French support, local payment methods, competitive pricing in TND, and on-premise deployment options.

## 📊 Market Positioning

### Target Market
- **Primary**: Tunisian SMBs (50-500 employees)
  - Manufacturing facilities in Sfax
  - Hotels in coastal areas (Sousse, Hammamet, Djerba)
  - Healthcare facilities in Tunis
  - Educational institutions
- **Secondary**: Large enterprises requiring data sovereignty
- **Future**: North African expansion (Algeria, Morocco, Libya)

### Competitive Advantages
1. **Localization**: Full Arabic/French UI/UX
2. **Pricing**: 40-60% cheaper than MaintainX
3. **Payment**: TND pricing, local payment methods (Flouci, D17, bank transfers)
4. **Support**: Local technical support and on-site training
5. **Deployment**: Cloud + On-premise options
6. **WhatsApp**: Native integration (very popular in Tunisia)
7. **Offline-first**: Works in areas with spotty internet

## 🏗️ Technical Stack

### Backend
- **Framework**: Node.js with NestJS
- **Database**: PostgreSQL (with Prisma ORM)
- **Cache**: Redis
- **Search**: Elasticsearch
- **Time-series**: TimescaleDB (for metrics/analytics)
- **Storage**: MinIO (S3-compatible)
- **Message Queue**: RabbitMQ/Kafka

### Frontend
- **Web**: React with Next.js (SSR for SEO)
- **Mobile**: PWA initially → React Native later
- **State Management**: Redux Toolkit / Zustand
- **UI Library**: shadcn/ui + Tailwind CSS
- **Forms**: React Hook Form + Zod validation

### Mobile Strategy
- **Phase 1**: Progressive Web App (PWA)
  - Faster development (1 codebase)
  - Instant updates
  - Offline capability via Service Workers
- **Phase 2**: React Native (when funding available)
  - Better native features (camera, push notifications)
  - App store presence
  - Better offline experience

### Infrastructure
- **Deployment**: Docker + Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **APM**: Sentry for error tracking

## 👥 User Roles & Permissions

### Role Hierarchy
1. **Super Admin** (System level)
   - Manage multiple organizations
   - System configuration
   - Billing management

2. **Admin** (Organization level)
   - Full organizational control
   - User management
   - Settings & integrations
   - Billing & subscription

3. **Manager**
   - View all work orders
   - Assign work orders
   - Approve requests
   - Generate reports
   - Manage teams

4. **Engineer/Technician**
   - Create/complete work orders
   - Update asset information
   - Log parts usage
   - Submit work requests
   - View assigned tasks

5. **Requester** (Basic user)
   - Submit work requests
   - View request status
   - Receive notifications
   - Basic asset viewing

### Industry-Specific Roles
- **Manufacturing**: Production Manager, Maintenance Engineer, Machine Operator
- **Hospitality**: Facility Manager, Housekeeping Supervisor, Front Desk
- **Healthcare**: Biomedical Engineer, Facility Director, Clinical Staff
- **Education**: Facility Manager, Campus Security, Department Heads

## 💰 Pricing Model (MaintainX-inspired)

### Subscription Tiers

#### Free Tier
- 5 users max
- 50 assets max
- Basic work orders
- Mobile app access
- Community support
- **Price**: 0 TND/month

#### Starter
- 10 users
- 200 assets
- Preventive maintenance
- Basic reports
- Email support
- **Price**: 150 TND/month (~$50 USD)

#### Professional
- 25 users
- Unlimited assets
- Advanced PM scheduling
- Custom forms & checklists
- Advanced analytics
- Priority support
- API access
- **Price**: 400 TND/month (~$130 USD)

#### Enterprise
- Unlimited users
- Unlimited assets
- White-labeling
- On-premise deployment
- SSO/SAML
- Dedicated support
- Custom integrations
- SLA guarantees
- **Price**: Custom (1,200+ TND/month)

### Add-ons
- Extra users: 30 TND/user/month
- WhatsApp Business API: 50 TND/month
- Advanced AI features: 100 TND/month
- On-site training: 500 TND/day

## 🗓️ Development Timeline

### Phase 1: MVP (Month 1) ✅ CURRENT FOCUS
**Goal**: Launch functional CMMS with core features

**Week 1-2: Foundation**
- Database schema & Prisma setup
- Authentication & authorization
- Basic API structure
- Admin panel setup

**Week 3-4: Core Features**
- Work order CRUD
- Asset management
- User management
- Basic PM scheduling
- Mobile PWA shell

**Week 5-6: Essential Features**
- Notifications (email, SMS)
- File uploads (photos)
- Basic dashboard
- Search functionality

**Week 7-8: Polish & Launch**
- Arabic/French translations
- Testing & bug fixes
- Documentation
- Beta customer onboarding

### Phase 2: Growth Features (Months 2-3)
- Inventory management
- Custom forms & checklists
- Calendar/scheduling UI
- Advanced reporting
- WhatsApp integration
- QR code scanning

### Phase 3: Enterprise Features (Months 4-6)
- Multi-location support
- Purchase orders
- Vendor management
- Advanced analytics
- Audit trails
- SSO/SAML
- API webhooks

### Phase 4: Advanced Features (Months 7-12)
- Predictive maintenance (AI)
- IoT sensor integration
- Mobile apps (React Native)
- Document management
- Compliance tracking
- Advanced workflows

## 🎯 Success Metrics

### Technical KPIs
- API response time: <200ms (p95)
- Mobile app load time: <2s
- Uptime: 99.9%
- Bug resolution: <48 hours
- Feature deployment: Weekly

### Business KPIs
- **Month 3**: 10 paying customers
- **Month 6**: 50 paying customers, 30,000 TND MRR
- **Month 12**: 200 customers, 120,000 TND MRR
- Customer churn: <5% monthly
- NPS Score: >40

## 🚀 Go-to-Market Strategy

### Phase 1: Friends & Family (Month 1-2)
- 5 beta customers (free)
- Focus on manufacturing in Sfax
- Gather feedback, iterate quickly

### Phase 2: Early Adopters (Month 3-4)
- 20 paid customers
- Case studies & testimonials
- Facebook ads targeting facility managers
- LinkedIn outreach

### Phase 3: Growth (Month 5-8)
- 100 customers
- Content marketing (blog, YouTube tutorials in Arabic)
- Partnerships with industrial equipment suppliers
- Trade shows & industry events

### Phase 4: Scale (Month 9-12)
- 200+ customers
- Sales team (2-3 people)
- Channel partners
- Regional expansion

## 🔐 Compliance & Security

### Data Protection
- GDPR-compliant (for EU customers)
- Tunisia's data protection law (Law 2004-63)
- SOC 2 Type II (future)
- ISO 27001 (future)

### Security Features
- End-to-end encryption
- Role-based access control (RBAC)
- Two-factor authentication (2FA)
- Audit logs
- Regular security audits
- Data backups (daily, 30-day retention)

## 📚 Documentation Structure

This project includes:
1. `00-PROJECT_OVERVIEW.md` ← You are here
2. `01-TECHNICAL_ARCHITECTURE.md` - System design
3. `02-DATABASE_SCHEMA.md` - Data models
4. `03-API_SPECIFICATIONS.md` - API endpoints
5. `04-CURSOR_RULES.md` - AI coding guidelines
6. `05-DEVELOPMENT_GUIDELINES.md` - Code standards
7. `06-USER_STORIES.md` - Feature requirements
8. `07-PHASE_1_ROADMAP.md` - MVP plan
9. `08-TUNISIA_LOCALIZATION.md` - i18n requirements
10. `09-SECURITY_COMPLIANCE.md` - Security specs

## 🤝 Contributing

Solo developer initially, but documentation prepared for future team growth.

### Development Workflow
1. Feature branches from `develop`
2. PR reviews (self-review initially)
3. Automated testing
4. Deploy to staging
5. Manual QA
6. Deploy to production

## 📞 Contact & Support

**Developer**: [Your Name]
**Email**: [Your Email]
**Location**: Tunis, Tunisia
**Repository**: [GitHub URL]

---

**Last Updated**: December 24, 2025
**Version**: 1.0.0
**Status**: 🚧 In Active Development