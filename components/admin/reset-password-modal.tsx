'use client';

import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { KeyRound, Sparkles, Copy, Check } from 'lucide-react';

interface ResetPasswordModalProps {
  userId: string | null;
  userName?: string;
  open: boolean;
  onClose: () => void;
  onConfirmReset: (userId: string, newPass: string) => Promise<void>;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  userId,
  userName,
  open,
  onClose,
  onConfirmReset,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateStrongPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pass = 'Vistora@2026!';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setFieldsValue({ password: pass, confirmPassword: pass });
  };

  const handleCopy = () => {
    const pass = form.getFieldValue('password');
    if (pass) {
      navigator.clipboard.writeText(pass);
      setCopied(true);
      message.success('Password copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFinish = async (values: any) => {
    if (!userId) return;
    setLoading(true);
    try {
      await onConfirmReset(userId, values.password);
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white text-base">
          <KeyRound className="w-5 h-5 text-indigo-600" />
          <span>Reset Staff Password — {userName}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Confirm Password Reset"
    >
      <div className="py-2 space-y-4">
        <p className="text-xs text-slate-500 font-medium">
          Set a new secure access credential for staff user account <strong>{userName}</strong>.
        </p>

        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="password"
            label="New Secure Password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 8, message: 'Must be at least 8 characters' },
            ]}
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Password confirmation is required' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Re-enter new password" />
          </Form.Item>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="dashed"
              icon={<Sparkles className="w-4 h-4 text-indigo-600" />}
              onClick={generateStrongPassword}
              className="text-xs font-bold rounded-xl"
            >
              Generate Strong Password
            </Button>

            <Button
              type="text"
              icon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopy}
              className="text-xs font-semibold"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};
