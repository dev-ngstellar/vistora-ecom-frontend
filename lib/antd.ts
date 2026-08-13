'use client';

import { App } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

let message: MessageInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;
let notification: NotificationInstance;

export default function AntdStaticSetter() {
  const staticObjects = App.useApp();
  message = staticObjects.message;
  modal = staticObjects.modal;
  notification = staticObjects.notification;
  return null;
}

export { message, modal, notification };
