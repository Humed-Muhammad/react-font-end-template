import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  FileText,
  Mail,
  Calendar,
  Users,
  Lock,
  Eye,
  AlertTriangle,
  Settings,
  Cookie,
} from "lucide-react";

export default function LegalPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center flex-col md:flex-row gap-2 justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Legal Information
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your privacy and security are our top priorities. Please review our
            terms and policies below.
          </p>
        </motion.div>

        <Tabs defaultValue="terms" className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border shadow-lg">
              <TabsTrigger
                value="terms"
                className="flex items-center gap-2 text-base font-medium"
              >
                <FileText className="h-4 w-4" />
                Terms of Service
              </TabsTrigger>
              <TabsTrigger
                value="privacy"
                className="flex items-center gap-2 text-base font-medium"
              >
                <Lock className="h-4 w-4" />
                Privacy Policy
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="terms">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                          Terms of Service
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>Effective Date: July 28, 2025</span>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          Welcome to <strong>Autofaceless</strong>! These Terms
                          of Service ("Terms") govern your use of our website,
                          products, and services ("Services"). By accessing or
                          using our Services, you agree to be bound by these
                          Terms.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            User Responsibilities
                          </h3>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              You must be at least 13 years old to use our
                              Services
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              Use the Services only for lawful purposes
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              You're responsible for maintaining account
                              security
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                              Respect intellectual property rights
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                            Service Terms
                          </h3>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              We may terminate accounts violating policies or
                              laws
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              Subscriptions may incur charges and are
                              non-refundable
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              All content is owned/licensed and protected
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></span>
                              Services provided "as is" with limited liability
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">
                          Additional Terms
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                              Modifications
                            </h4>
                            <p>
                              We reserve the right to modify these terms at any
                              time. Changes will be effective upon posting.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                              Governing Law
                            </h4>
                            <p>
                              These terms are governed by the laws of the
                              jurisdiction where our company is incorporated.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Mail className="h-6 w-6 text-blue-600" />
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              Questions or Concerns?
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400">
                              Contact us at:{" "}
                              <a
                                href="mailto:support@autofaceless.com"
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                support@autofaceless.com
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="privacy">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Lock className="h-8 w-8 text-green-600" />
                      <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                          Privacy Policy
                        </h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>Effective Date: July 28, 2025</span>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6">
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border-l-4 border-green-500">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          This Privacy Policy explains how{" "}
                          <strong>Autofaceless</strong> collects, uses, stores,
                          and protects your personal information when you use
                          our services.
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Eye className="h-5 w-5 text-blue-600" />
                            Data Collection
                          </h3>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              Personal information (name, email, phone)
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              Usage data and analytics
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              Device information and IP addresses
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                              Cookies and tracking technologies
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Settings className="h-5 w-5 text-purple-600" />
                            Data Usage
                          </h3>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              Provide and improve our services
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              Communicate with you about updates
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              Analyze usage patterns and trends
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                              Ensure security and prevent fraud
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Lock className="h-5 w-5 text-indigo-600" />
                            Data Protection
                          </h3>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                              End-to-end encryption for sensitive data
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                              Regular security audits and updates
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                              Limited access on need-to-know basis
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                              Secure data centers and backups
                            </li>
                          </ul>
                        </div>

                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2">
                            <Cookie className="h-5 w-5 text-orange-600" />
                            Your Rights
                          </h3>
                          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              Access and download your data
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              Correct inaccurate information
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              Delete your account and data
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                              Opt-out of marketing communications
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4">
                          Data Retention & Sharing
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-600 dark:text-slate-400">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                              Retention Period
                            </h4>
                            <p>
                              We retain your data only as long as necessary to
                              provide services or as required by law. Account
                              data is deleted within 30 days of account closure.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                              Third-Party Sharing
                            </h4>
                            <p>
                              We do not sell your personal data. We may share
                              data with trusted service providers under strict
                              confidentiality agreements.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <Shield className="h-6 w-6 text-green-600" />
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              Privacy Questions?
                            </h4>
                            <p className="text-slate-600 dark:text-slate-400">
                              Contact our privacy team at:{" "}
                              <a
                                href="mailto:privacy@autofaceless.com"
                                className="text-green-600 hover:text-green-700 font-medium"
                              >
                                privacy@autofaceless.com
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white mb-1">
                              Important Notice
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300">
                              This privacy policy may be updated periodically.
                              We will notify you of significant changes via
                              email or through our service notifications.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
