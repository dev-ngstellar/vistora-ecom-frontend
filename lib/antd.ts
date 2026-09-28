'use client';

import React from 'react';
import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';
import toast from 'react-hot-toast';

let messageInstance: MessageInstance | null = null;
let modalInstance: Omit<ModalStaticFunctions, 'warn'> | null = null;
let notificationInstance: NotificationInstance | null = null;

export default function AntdStaticSetter() {
  const staticObjects = App.useApp();
  messageInstance = staticObjects.message;
  modalInstance = staticObjects.modal;
  notificationInstance = staticObjects.notification;
  return null;
}

export const message: MessageInstance = new Proxy({} as MessageInstance, {
  get(_target, prop) {
    if (messageInstance && (messageInstance as any)[prop]) {
      return (messageInstance as any)[prop];
    }
    if (prop === 'success') {
      return (content: any) => toast.success(typeof content === 'string' ? content : content?.content || '');
    }
    if (prop === 'error') {
      return (content: any) => toast.error(typeof content === 'string' ? content : content?.content || '');
    }
    if (prop === 'info' || prop === 'loading') {
      return (content: any) => toast(typeof content === 'string' ? content : content?.content || '');
    }
    return () => {};
  },
});

export const modal: Omit<ModalStaticFunctions, 'warn'> = new Proxy({} as Omit<ModalStaticFunctions, 'warn'>, {
  get(_target, prop) {
    if (modalInstance && (modalInstance as any)[prop]) {
      return (modalInstance as any)[prop];
    }
    return () => {};
  },
});

export const notification: NotificationInstance = new Proxy({} as NotificationInstance, {
  get(_target, prop) {
    if (notificationInstance && (notificationInstance as any)[prop]) {
      return (notificationInstance as any)[prop];
    }
    return () => {};
  },
});


