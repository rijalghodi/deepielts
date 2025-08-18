# Billing System Implementation

This document describes the billing system implementation using Paddle Node SDK for the IELTS Writing AI application.

## Overview

The billing system provides users with:

1. Current subscription plan information
2. Transaction history with invoice links
3. Subscription management (update/cancel)

## Architecture

### Frontend Components

- **Billing Page** (`/billing`): Main billing interface
- **Responsive Design**: Desktop and mobile layouts
- **Real-time Data**: Fetches subscription and transaction data from API

### Backend API Endpoints

- **GET** `/api/billing/subscription?userId={userId}`: Fetch current subscription
- **GET** `/api/billing/transactions?customerId={customerId}`: Fetch transaction history
- **POST** `/api/billing/subscription/{subscriptionId}/cancel`: Cancel subscription

### Database Models

- **Subscription**: Stores subscription details from Paddle webhooks
- **User**: Links to subscription data

## Implementation Details

### Paddle Integration

The system uses Paddle Node SDK for:

- Subscription management
- Transaction retrieval
- Webhook processing

### Authentication

Currently uses mock user IDs for demonstration. In production:

1. Implement proper authentication middleware
2. Extract user ID from JWT/session
3. Validate user permissions

### Data Flow

1. **Subscription Data**: Stored in Firestore, updated via Paddle webhooks
2. **Transaction Data**: Fetched directly from Paddle API
3. **Real-time Updates**: Webhooks ensure data consistency

## Setup Requirements

### Environment Variables

```bash
PADDLE_API_KEY=your_paddle_api_key
PADDLE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_PADDLE_ENV=sandbox|production
```

### Paddle Webhook Configuration

Configure Paddle webhooks to point to:

```
POST /api/webhooks/paddle
```

Required events:

- `subscription.created`
- `subscription.updated`
- `subscription.canceled`
- `subscription.past_due`
- `subscription.paused`

## Usage

### For Users

1. Navigate to `/billing` from the sidebar
2. View current subscription status
3. Access transaction history and invoices
4. Update or cancel subscription

### For Developers

1. **Adding New Features**: Extend the billing API endpoints
2. **Customization**: Modify the UI components in `src/app/(app-layout)/billing/`
3. **Testing**: Use Paddle sandbox environment

## Security Considerations

1. **API Protection**: Implement proper authentication for billing endpoints
2. **Webhook Validation**: Verify Paddle webhook signatures
3. **Data Privacy**: Ensure user data is properly isolated
4. **Rate Limiting**: Implement API rate limiting

## Future Enhancements

1. **Payment Method Management**: Allow users to update payment methods
2. **Billing Alerts**: Notify users of upcoming charges
3. **Usage Analytics**: Track subscription usage patterns
4. **Multi-currency Support**: Handle different currencies
5. **Tax Calculation**: Integrate tax calculation services

## Troubleshooting

### Common Issues

1. **Missing Subscription Data**: Check webhook configuration
2. **API Errors**: Verify Paddle API key and environment
3. **Transaction Display**: Ensure customer ID is properly set

### Debug Mode

Enable debug logging by setting:

```bash
PADDLE_LOG_LEVEL=debug
```

## Support

For technical support:

1. Check Paddle documentation
2. Review webhook logs
3. Verify environment configuration
4. Test with Paddle sandbox environment
