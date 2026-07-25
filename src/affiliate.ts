import crypto from 'crypto';

export interface AffiliateUser {
  userId: string;
  referralCode: string;
  totalEarnings: number;
  totalReferrals: number;
  completedConversions: number;
  commissionRate: number;
  createdAt: Date;
}

export class AffiliateManager {
  private commissionRates = {
    starter: 0.3, // 30% of $4.99 = $1.50
    pro: 0.3, // 30% of $14.99 = $4.50
    enterprise: 0.25, // 25% of $99.99 = $25.00
  };

  private prices = {
    starter: 4.99,
    pro: 14.99,
    enterprise: 99.99,
  };

  generateReferralCode(userId: string): string {
    const hash = crypto
      .createHash('md5')
      .update(`${userId}-${Date.now()}`)
      .digest('hex')
      .substring(0, 8)
      .toUpperCase();
    return `PS${hash}`;
  }

  calculateCommission(planType: 'starter' | 'pro' | 'enterprise'): number {
    return Math.round(
      this.prices[planType] * this.commissionRates[planType] * 100
    ) / 100;
  }

  generateAffiliateLink(referralCode: string): string {
    return `https://t.me/proofstampbot?start=ref_${referralCode}`;
  }

  getAffiliateKeyboard() {
    return {
      inline_keyboard: [
        [{ text: '🔗 My Referral Link', callback_data: 'affiliate_link' }],
        [{ text: '💰 My Earnings', callback_data: 'affiliate_earnings' }],
        [{ text: '📊 Stats', callback_data: 'affiliate_stats' }],
        [{ text: '💳 Payout Settings', callback_data: 'affiliate_payout' }],
      ],
    };
  }

  generateDashboardMessage(
    earnings: number,
    referrals: number,
    conversions: number
  ): string {
    return `
📊 **Your Affiliate Dashboard**

💰 **Total Earnings**: $${earnings.toFixed(2)}
🔗 **Total Referrals**: ${referrals}
✅ **Completed Conversions**: ${conversions}
📈 **Conversion Rate**: ${((conversions / (referrals || 1)) * 100).toFixed(1)}%

**Commission Rates:**
⭐ Starter: $${this.calculateCommission('starter')}/ref (30%)
🚀 Pro: $${this.calculateCommission('pro')}/ref (30%)
💼 Enterprise: $${this.calculateCommission('enterprise')}/ref (25%)

**Payouts:**
Next payout on: 15 Feb 2024
Pending balance: $${earnings.toFixed(2)}
Minimum payout: $10

/affiliate to manage
    `;
  }

  generateAffiliateHTML(): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ProofStamp Affiliate Program</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
          }
          h1 { color: #667eea; margin-bottom: 10px; text-align: center; }
          .hero { text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1)); border-radius: 10px; }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 30px 0;
          }
          .stat-box {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
          }
          .stat-number { font-size: 2rem; font-weight: bold; }
          .stat-label { font-size: 0.9rem; opacity: 0.9; }
          .commission-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .commission-table th, .commission-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          .commission-table th {
            background: #667eea;
            color: white;
          }
          .cta-button {
            display: inline-block;
            padding: 12px 25px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            margin: 10px 5px;
            transition: background 0.3s;
          }
          .cta-button:hover { background: #764ba2; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🎯 ProofStamp Affiliate Program</h1>
          
          <div class="hero">
            <p><strong>Earn 25-30% commission on every referral!</strong></p>
            <p>Start earning today by sharing your unique referral link</p>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-number">25-30%</div>
              <div class="stat-label">Commission Rate</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">♾️</div>
              <div class="stat-label">Recurring Income</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">💰</div>
              <div class="stat-label">Lifetime Earning</div>
            </div>
            <div class="stat-box">
              <div class="stat-number">📈</div>
              <div class="stat-label">Real-time Tracking</div>
            </div>
          </div>

          <h2 style="color: #667eea; margin: 30px 0 20px;">💰 Commission Structure</h2>
          <table class="commission-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Your Commission</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>⭐ Starter</td>
                <td>$4.99/month</td>
                <td><strong>$1.50</strong> (30%)</td>
              </tr>
              <tr>
                <td>🚀 Pro</td>
                <td>$14.99/month</td>
                <td><strong>$4.50</strong> (30%)</td>
              </tr>
              <tr>
                <td>💼 Enterprise</td>
                <td>$99.99/month</td>
                <td><strong>$25.00</strong> (25%)</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://t.me/proofstampbot?start=affiliate" class="cta-button">Join Affiliate Program</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export const affiliateManager = new AffiliateManager();
