'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MenuIcon,
  LayoutDashboardIcon,
  UsersIcon,
  PackageIcon,
  FolderIcon,
  FolderOpenIcon,
  PuzzleIcon,
  TagIcon,
  WrenchIcon,
  BarChart3Icon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UndoIcon,
  DollarSignIcon,
  PackageCheckIcon,
  ShieldIcon,
  LockIcon,
  FileTextIcon,
  SettingsIcon,
  LogOutIcon,
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // Fetch pending orders count
  useEffect(() => {
    const fetchOrdersCount = async () => {
      try {
        const response = await fetch('/api/orders/count');
        if (response.ok) {
          const data = await response.json();
          setPendingOrdersCount(data.pendingCount);
        }
      } catch (error) {
        console.error('Error fetching orders count:', error);
      }
    };

    if (session) {
      fetchOrdersCount();
      // Refresh count every 30 seconds
      const interval = setInterval(fetchOrdersCount, 30000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!session) return <div>{children}</div>;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboardIcon, category: 'main' },
    { name: 'Customers', href: '/users', icon: UsersIcon, category: 'main' },
    { name: 'Services', href: '/products', icon: PackageIcon, category: 'main' },
    
    { name: 'Inventory', href: '/inventory', icon: BarChart3Icon, category: 'operations' },
    { name: 'Orders', href: '/orders', icon: ShoppingCartIcon, category: 'operations', badge: pendingOrdersCount > 0 ? pendingOrdersCount : null },
    { name: 'Reports', href: '/reports', icon: TrendingUpIcon, category: 'operations' },
    { name: 'Returns', href: '/returns', icon: UndoIcon, category: 'operations' },
    { name: 'Refunds', href: '/refunds', icon: DollarSignIcon, category: 'operations' },
    { name: 'Shipping Labels', href: '/shipping-labels', icon: PackageCheckIcon, category: 'operations' },
    { name: 'Categories', href: '/categories', icon: FolderIcon, category: 'catalog' },
    { name: 'Subcategories', href: '/subcategories', icon: FolderOpenIcon, category: 'catalog' },
    { name: 'Addons', href: '/addons', icon: PuzzleIcon, category: 'catalog' },
    { name: 'Tasks', href: '/variation-attributes', icon: TagIcon, category: 'catalog' },
    { name: 'Product Variants', href: '/product-variants', icon: WrenchIcon, category: 'catalog' },
    { name: 'Admin Users', href: '/admins', icon: ShieldIcon, category: 'admin' },
    { name: 'Admin Roles', href: '/roles', icon: LockIcon, category: 'admin' },
    { name: 'Admin Logs', href: '/logs', icon: FileTextIcon, category: 'admin' },
    { name: 'Settings', href: '/settings', icon: SettingsIcon, category: 'admin' },
    { name: 'Logout', href: '/logout', icon: LogOutIcon, category: 'admin' },
  ];

  const categories = {
    main: { name: 'Main', items: navigation.filter(item => item.category === 'main') },
    operations: { name: 'Operations', items: navigation.filter(item => item.category === 'operations') },
    catalog: { name: 'Catalog', items: navigation.filter(item => item.category === 'catalog') },
    admin: { name: 'Administration', items: navigation.filter(item => item.category === 'admin') },
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  const NavItem = ({ item, mobile = false, collapsed = false }: { item: typeof navigation[0], mobile?: boolean, collapsed?: boolean }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent ${
          active ? 'bg-accent text-accent-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
        }`}
        onClick={() => mobile && setSidebarOpen(false)}
        title={collapsed ? item.name : undefined}
      >
        <Icon className="h-4 w-4 flex-shrink-0" />
        {!collapsed && (
          <>
            <span className="truncate">{item.name}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs">
                {item.badge > 99 ? '99+' : item.badge}
              </Badge>
            )}
          </>
        )}
        {collapsed && item.badge && (
          <Badge variant="secondary" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
            {item.badge > 99 ? '99+' : item.badge}
          </Badge>
        )}
      </Link>
    );
  };

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full max-h-screen flex-col gap-2 fixed">
      {/* Header */}
      <div className={`flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 ${sidebarCollapsed && !mobile ? 'justify-center' : ''}`}>
        <Link href="/" className={`flex items-center gap-2 font-semibold ${sidebarCollapsed && !mobile ? 'justify-center' : ''}`}>
          <LayoutDashboardIcon className="h-6 w-6 flex-shrink-0" />
          {(!sidebarCollapsed || mobile) && <span className="truncate">Admin Panel</span>}
        </Link>
        {mobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={() => setSidebarOpen(false)}
          >
            <XIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Collapse Toggle Button for Desktop */}
      {!mobile && (
        <div className="px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`w-full justify-center ${sidebarCollapsed ? 'px-2' : ''}`}
          >
            {sidebarCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {Object.entries(categories).map(([key, category]) => (
            <div key={key} className="mb-4">
              {(!sidebarCollapsed || mobile) && (
                <div className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {category.name}
                </div>
              )}
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div key={item.name} className="relative">
                    <NavItem item={item} mobile={mobile} collapsed={sidebarCollapsed && !mobile} />
                  </div>
                ))}
              </div>
              {key !== 'admin' && (!sidebarCollapsed || mobile) && <Separator className="my-4" />}
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile */}
      <div className="mt-auto p-4">
        <div className={`flex items-center gap-3 rounded-lg bg-muted/50 p-3 ${sidebarCollapsed && !mobile ? 'justify-center' : ''}`}>
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarFallback>
              {session?.user?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          {(!sidebarCollapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const sidebarWidth = sidebarCollapsed ? 'md:grid-cols-[80px_1fr] lg:grid-cols-[80px_1fr]' : 'md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]';

  return (
    <div className={`grid min-h-screen w-full max-w-full overflow-hidden ${sidebarWidth}`}>
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block overflow-y-auto">
        <SidebarContent />
      </div>

      <div className="flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden flex-shrink-0">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 relative">
                <MenuIcon className="h-5 w-5" />
                {pendingOrdersCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {pendingOrdersCount > 99 ? '99+' : pendingOrdersCount}
                  </Badge>
                )}
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <SidebarContent mobile={true} />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1 min-w-0">
            <h1 className="text-lg font-semibold truncate">Admin Panel</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 overflow-auto min-w-0 max-w-full">
          <div className="w-full max-w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 