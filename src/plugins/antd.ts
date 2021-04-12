import { App } from 'vue'
import {
  ConfigProvider,
  Menu,
  Button,
  Card,
  Form,
  Select,
  Input,
  Breadcrumb,
  Dropdown,
  Layout,
  Table,
  Row,
  Col,
  Drawer,
  Divider,
  Tabs,
  Switch,
} from 'ant-design-vue'

export const components = [
  ConfigProvider,
  Menu,
  Button,
  Card,
  Form,
  Select,
  Input,
  Row,
  Col,
  Breadcrumb,
  Tabs,
  Divider,
  Dropdown,
  Layout,
  Table,
  Drawer,
  Switch,
]

export default {
  install: (app: App) => {
    components.forEach((component) => {
      app.use(component)
    })
  },
}
