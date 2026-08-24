<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\ActivityUpdate;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with realistic support operations data.
     */
    public function run(): void
    {
        // 1. Create Default Admin / Test Personnel User
        $mainUser = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Desmond Owusu',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Support Operations Team Members
        $teamMembers = [
            $mainUser,
            User::firstOrCreate(['email' => 'alex.morgan@appsupport.ops'], [
                'name' => 'Alex Morgan',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]),
            User::firstOrCreate(['email' => 'sarah.chen@appsupport.ops'], [
                'name' => 'Sarah Chen',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]),
            User::firstOrCreate(['email' => 'marcus.vance@appsupport.ops'], [
                'name' => 'Marcus Vance',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]),
            User::firstOrCreate(['email' => 'priya.sharma@appsupport.ops'], [
                'name' => 'Priya Sharma',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]),
            User::firstOrCreate(['email' => 'david.kim@appsupport.ops'], [
                'name' => 'David Kim',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]),
        ];

        // 3. Define Support Activity Scenarios
        $scenarios = [
            // Today's Shift Activities
            [
                'title' => 'Database Connection Pool Exhaustion on Payments Service',
                'description' => 'Observed spikes in DB connection timeout errors on the payment-gateway cluster during peak traffic. Max connection limit increased from 100 to 250.',
                'days_ago' => 0,
                'status' => 'done',
                'initial_remark' => 'Investigating DB pool exhaustion alerts in Grafana.',
                'final_remark' => 'Scaled connection pool parameters in Helm values and redeployed pod replica set. Latency normalized.',
            ],
            [
                'title' => 'High Latency Spike Detected on Auth Middleware',
                'description' => 'p99 latency reached 1400ms on /api/v1/auth/token endpoint due to unindexed Redis session lookup key.',
                'days_ago' => 0,
                'status' => 'done',
                'initial_remark' => 'Auth service response times degraded. Tracing via Jaeger.',
                'final_remark' => 'Applied Redis index optimization and restarted auth service worker nodes. p99 down to 35ms.',
            ],
            [
                'title' => 'SSL Certificate Auto-Renewal Verification for API Gateway',
                'description' => 'LetsEncrypt SSL wildcard cert renewal scheduled for *.api.appsupport.ops. Need DNS-01 challenge validation.',
                'days_ago' => 0,
                'status' => 'pending',
                'initial_remark' => 'Initiated cert-manager renewal challenge workflow in k8s cluster.',
                'final_remark' => 'Awaiting Cloudflare DNS propagation for TXT verification record.',
            ],
            [
                'title' => 'Failed Webhook Retry Worker Queue Bottleneck',
                'description' => 'Over 14,000 webhook events stuck in dead-letter queue due to third-party vendor endpoint rate limiting.',
                'days_ago' => 0,
                'status' => 'pending',
                'initial_remark' => 'Identified back-off exponential retry delay failure in Horizon worker group.',
                'final_remark' => 'Throttled concurrency worker rate to 50 req/sec; worker queue draining steadily.',
            ],
            [
                'title' => 'Daily Database Backup Integrity Check & Snapshot Validation',
                'description' => 'Routine automated PostgreSQL WAL archive backup integrity test and point-in-time restore simulation.',
                'days_ago' => 0,
                'status' => 'done',
                'initial_remark' => 'Started automated staging environment PITR restore script from S3 backup bucket.',
                'final_remark' => 'Restore completed successfully in 4m 12s. Checksum validation verified 100% data match.',
            ],

            // Yesterday's Activities
            [
                'title' => 'OAuth Token Service Intermittent 502 Bad Gateway Errors',
                'description' => 'Nginx ingress controller logged 502 errors due to upstream buffer overflow on large JWT claims payloads.',
                'days_ago' => 1,
                'status' => 'done',
                'initial_remark' => 'Users reporting sporadic session disconnects.',
                'final_remark' => 'Increased proxy_buffer_size and proxy_buffers in Nginx ConfigMap. Incident resolved.',
            ],
            [
                'title' => 'Kubernetes Pod OOMKilled Triggered on Order Ingestion Service',
                'description' => 'Order Ingestion pod replica #3 crashed due to memory leak in bulk JSON parsing routine.',
                'days_ago' => 1,
                'status' => 'done',
                'initial_remark' => 'Alertmanager notified OOMKilled condition on pod order-ingestion-7f99b.',
                'final_remark' => 'Increased pod memory limits from 512MB to 1GB and patched streaming JSON parser memory leak.',
            ],
            [
                'title' => 'RabbitMQ Dead Letter Queue Inspection and Re-queueing',
                'description' => 'Audit log consumer queue accumulated 450 messages due to schema mismatch on legacy event format.',
                'days_ago' => 1,
                'status' => 'done',
                'initial_remark' => 'Dead-letter queue consumer failed with JSON deserialization exception.',
                'final_remark' => 'Applied schema fallback transformer script and re-queued all messages successfully.',
            ],
            [
                'title' => 'ElasticSearch Index Optimization for Audit Log Pipeline',
                'description' => 'Logstash pipeline throughput dropped due to un-sharded monthly log indices.',
                'days_ago' => 1,
                'status' => 'pending',
                'initial_remark' => 'ElasticSearch disk usage reached 82% threshold on data node 2.',
                'final_remark' => 'Created ILM lifecycle policy for automatic index rollover after 30 days.',
            ],

            // Past 2 to 7 Days Activities
            [
                'title' => 'AWS S3 Bucket CORS Configuration Update for Uploads',
                'description' => 'Frontend file upload widget blocked by CORS policy update on document storage bucket.',
                'days_ago' => 2,
                'status' => 'done',
                'initial_remark' => 'Uploaded files throwing HTTP 403 CORS pre-flight error.',
                'final_remark' => 'Updated S3 AllowedOrigins and AllowedHeaders policy rules via Terraform configuration.',
            ],
            [
                'title' => 'Cloudflare CDN Edge Rules Cache Invalidation for Static Assets',
                'description' => 'Stale Javascript bundles served after release build 2.4.1 due to aggressive CDN cache header setting.',
                'days_ago' => 3,
                'status' => 'done',
                'initial_remark' => 'Purged Cloudflare edge cache by tag assets-v2.4.1.',
                'final_remark' => 'Cache purged globally across edge locations. Users receiving new assets.',
            ],
            [
                'title' => 'PostgreSQL Vacuum & Index Maintenance Scheduled Task Execution',
                'description' => 'Weekly VACUUM ANALYZE maintenance on high-churn activities and activity_updates tables.',
                'days_ago' => 4,
                'status' => 'done',
                'initial_remark' => 'Scheduled pg_maintenance cron task initiated.',
                'final_remark' => 'Table bloat reduced by 2.4 GB. Index scan latency improved by 18%.',
            ],
            [
                'title' => 'Prometheus Alert Manager Silencing Rules Update',
                'description' => 'Silenced non-critical staging cluster disk space warning alerts during scheduled database migration maintenance.',
                'days_ago' => 5,
                'status' => 'done',
                'initial_remark' => 'Applied 4-hour silence window for alertname=HostDiskWillFillIn4Hours.',
                'final_remark' => 'Maintenance window completed. Alert silences automatically expired.',
            ],
            [
                'title' => 'Customer Portal SSO Identity Provider Certificate Rotation',
                'description' => 'Rotated SAML 2.0 signing certificate for enterprise SSO provider integration.',
                'days_ago' => 6,
                'status' => 'done',
                'initial_remark' => 'Uploaded new public x509 cert to Okta & Azure AD enterprise app settings.',
                'final_remark' => 'Test SSO logins verified for both Okta and Azure AD test accounts.',
            ],
            [
                'title' => 'Kafka Cluster Broker Node 2 Disk Replacement Maintenance',
                'description' => 'Replaced failing NVMe drive on broker node kafka-prod-02 and rebalanced partition replicas.',
                'days_ago' => 7,
                'status' => 'done',
                'initial_remark' => 'SMART warnings logged on /dev/nvme1n1.',
                'final_remark' => 'Drive swapped under zero downtime rolling restart. Partition reassignment complete.',
            ],
        ];

        // 4. Seed Activities & Audit Log Updates
        foreach ($scenarios as $index => $data) {
            $creator = $teamMembers[$index % count($teamMembers)];
            $updater = $teamMembers[($index + 1) % count($teamMembers)];

            $createdAt = Carbon::now()->subDays($data['days_ago'])->subHours(rand(1, 8))->subMinutes(rand(0, 59));

            // Create Activity
            $activity = Activity::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'created_by' => $creator->id,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Initial Audit Log Update (when activity was logged)
            ActivityUpdate::create([
                'activity_id' => $activity->id,
                'user_id' => $creator->id,
                'status' => 'pending',
                'remarks' => $data['initial_remark'],
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            // Subsequent Audit Log Update (Resolution / Progress)
            $updateTime = (clone $createdAt)->addMinutes(rand(20, 180));
            ActivityUpdate::create([
                'activity_id' => $activity->id,
                'user_id' => $updater->id,
                'status' => $data['status'],
                'remarks' => $data['final_remark'],
                'created_at' => $updateTime,
                'updated_at' => $updateTime,
            ]);
        }
    }
}
