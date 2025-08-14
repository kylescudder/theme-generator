import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ArrowLeft,
  Search,
  Bell,
  Upload,
  HelpCircle,
  BarChart3,
  Calendar,
  Grid3X3,
  ChevronRight,
  Clock,
  Eye,
  MoreHorizontal
} from 'lucide-react'

interface ThemeColors {
  primary: string
  primaryRgb: string
  primaryContrast: string
  primaryContrastRgb: string
  primaryShade: string
  primaryTint: string
  secondary: string
  secondaryRgb: string
  secondaryContrast: string
  secondaryContrastRgb: string
  secondaryShade: string
  secondaryTint: string
}

interface PreviewPaneProps {
  colors: ThemeColors
}

export function PreviewPane({ colors }: PreviewPaneProps) {
  const mockJobs = [
    {
      title: 'Service Escalator',
      client: 'Amuso Co Default - Amuso Co',
      ref: 'NHM-48293-AZ',
      date: '25/07',
      time: '11:00 - 11:30'
    },
    {
      title: 'Inspect HVAC Unit',
      client: 'Amonicos Co Default - Amonicos Co',
      ref: 'GTS-19022-HV',
      date: '25/07',
      time: '12:00 - 12:30'
    },
    {
      title: 'Replace Damaged Wiring',
      client: 'William Cowley, 97 Caldecote St, Newpor...',
      ref: 'MRH-67544-EL',
      date: '25/07',
      time: '13:00 - 13:30'
    },
    {
      title: 'Test Fire Alarm System',
      client: 'Default - Village Hotels',
      ref: 'CBR-23451-FA',
      date: '25/07',
      time: '14:00 - 14:30'
    },
    {
      title: 'Calibrate Security Cameras',
      client: '54 Chelsea Square, London, SW3 6LH - ...',
      ref: 'ODC-80801-CM',
      date: '25/07',
      time: '15:00 - 15:30'
    },
    {
      title: 'Routine Elevator Maintenance',
      client: 'Atenua Co Default - Atenua Co',
      ref: 'ATL-99338-ELV',
      date: '25/07',
      time: '16:00 - 16:30'
    }
  ]

  const mockCustomers = [
    { name: '[KD] Customer - No Sites', initial: 'K' },
    { name: '[KS] Kyle Scudder', initial: 'K' },
    { name: 'a', initial: 'A' },
    { name: 'A. Crimson Tide UK', initial: 'A' },
    { name: 'A. Crimson Tide UK (A. )', initial: 'A' },
    { name: 'A. Crimson Tide UK (A. )', initial: 'A' },
    { name: 'AA', initial: 'A' },
    { name: 'Acme Import Corp.', initial: 'A' },
    { name: 'Acme Import Corp.', initial: 'C' }
  ]

  return (
    <div className='space-y-6'>
      {/* Login Screen Preview */}
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='bg-gray-50 px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Login Screen</h3>
        </div>
        <div className='flex flex-col' style={{ backgroundColor: '#f8f9fa' }}>
          <div className='flex items-center justify-between p-4 bg-white'>
            <ArrowLeft className='w-5 h-5 text-gray-700' />
            <div className='text-center'>
              <div
                className='text-2xl font-bold'
                style={{ color: colors.primary }}
              >
                :mpro5
              </div>
            </div>
            <div className='w-5 h-5' />
          </div>

          <div className='flex flex-col justify-center px-6 py-8'>
            <div className='mb-8'>
              <h1 className='text-2xl font-normal text-gray-900 mb-8'>
                Log in to your account
              </h1>

              <div className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    Username
                  </label>
                  <div className='relative'>
                    <Input className='pl-10 h-12 border-gray-300' />
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                      <div className='w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center'>
                        <div className='w-3 h-3 bg-white rounded-full' />
                      </div>
                    </div>
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                      <div className='flex space-x-1'>
                        <div className='w-1 h-1 bg-red-500 rounded-full' />
                        <div className='w-1 h-1 bg-red-500 rounded-full' />
                        <div className='w-1 h-1 bg-red-500 rounded-full' />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>
                    Password
                  </label>
                  <div className='relative'>
                    <Input
                      type='password'
                      className='pl-10 pr-16 h-12 border-gray-300'
                    />
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2'>
                      <div className='w-5 h-5 bg-gray-400 rounded' />
                    </div>
                    <div className='absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2'>
                      <div className='flex space-x-1'>
                        <div className='w-1 h-1 bg-red-500 rounded-full' />
                        <div className='w-1 h-1 bg-red-500 rounded-full' />
                        <div className='w-1 h-1 bg-red-500 rounded-full' />
                      </div>
                      <Eye className='w-4 h-4 text-gray-400' />
                    </div>
                  </div>
                </div>

                <div className='flex items-center justify-between text-sm'>
                  <a
                    href='#'
                    style={{ color: colors.primary }}
                    className='font-medium'
                  >
                    Forgot your password
                  </a>
                  <a
                    href='#'
                    style={{ color: colors.primary }}
                    className='font-medium'
                  >
                    Log in with SSO
                  </a>
                </div>

                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    className='w-4 h-4 rounded border-gray-300'
                  />
                  <span className='text-sm text-gray-900'>Remember Me</span>
                </div>

                <Button
                  className='w-full h-12 text-white font-medium text-base rounded-lg'
                  style={{
                    backgroundColor: colors.primary,
                    color: colors.primaryContrast
                  }}
                >
                  Log In
                </Button>
              </div>
            </div>

            <div className='flex justify-between text-sm text-gray-500 mt-8'>
              <span>Version: Internal Build</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List Preview */}
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='bg-gray-50 px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Jobs Screen</h3>
        </div>
        <div className='bg-white flex flex-col'>
          <div className='flex items-center justify-between p-4 border-b'>
            <div className='flex items-center space-x-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm'
                style={{ backgroundColor: colors.primary }}
              >
                KD
              </div>
              <h1 className='text-xl font-bold'>Jobs</h1>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='w-5 h-5 text-gray-600' />
              <Bell className='w-5 h-5 text-gray-600' />
              <Upload className='w-5 h-5 text-gray-600' />
            </div>
          </div>

          <div className='flex'>
            <button
              className='px-6 py-3 font-medium text-white text-sm rounded-t-lg'
              style={{ backgroundColor: colors.primary }}
            >
              All
            </button>
            <button className='px-6 py-3 text-gray-500 text-sm'>Active</button>
            <button className='px-6 py-3 text-gray-500 text-sm'>
              Scheduled
            </button>
          </div>

          <div className='flex-1'>
            {mockJobs.map((job, index) => (
              <div
                key={index}
                className='flex items-center p-4 border-b border-gray-100'
              >
                <div
                  className='w-1 h-16 rounded-full mr-4'
                  style={{ backgroundColor: '#fbbf24' }}
                />
                <div className='flex-1 min-w-0'>
                  <h3 className='font-semibold text-gray-900 text-base mb-1'>
                    {job.title}
                  </h3>
                  <p className='text-sm text-gray-600 mb-1 truncate'>
                    {job.client}
                  </p>
                  <p className='text-sm text-gray-500'>Client Ref: {job.ref}</p>
                </div>
                <div className='text-right ml-4'>
                  <div className='flex items-center text-sm text-gray-500 mb-1'>
                    <Calendar className='w-4 h-4 mr-1' />
                    {job.date}
                  </div>
                  <div className='flex items-center text-sm text-gray-500'>
                    <Clock className='w-4 h-4 mr-1' />
                    {job.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='flex border-t bg-white'>
            <div className='flex-1 text-center py-3 relative'>
              <div className='relative inline-block'>
                <BarChart3
                  className='w-6 h-6 mx-auto mb-1'
                  style={{ color: colors.primary }}
                />
                <div
                  className='absolute -top-1 -right-2 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
                  style={{ backgroundColor: colors.primary, fontSize: '10px' }}
                >
                  8
                </div>
              </div>
              <span
                className='text-xs font-medium'
                style={{ color: colors.primary }}
              >
                Jobs
              </span>
            </div>
            <div className='flex-1 text-center py-3'>
              <HelpCircle className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Online Query</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <BarChart3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Power BI</span>
            </div>
            <div className='flex-1 text-center py-3 relative'>
              <Calendar className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <div
                className='absolute top-2 right-1/2 translate-x-4 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
                style={{ backgroundColor: colors.primary, fontSize: '10px' }}
              >
                0
              </div>
              <span className='text-xs text-gray-400'>Scheduled Actions</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <Grid3X3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customers List Preview */}
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='bg-gray-50 px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Customers Screen</h3>
        </div>
        <div className='bg-white flex flex-col'>
          <div className='flex items-center justify-between p-4 border-b'>
            <div className='flex items-center space-x-3'>
              <div
                className='w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm'
                style={{ backgroundColor: colors.primary }}
              >
                KD
              </div>
              <h1 className='text-xl font-bold'>Flows</h1>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='w-5 h-5 text-gray-600' />
              <Bell className='w-5 h-5 text-gray-600' />
              <Upload className='w-5 h-5 text-gray-600' />
            </div>
          </div>

          <div className='flex-1'>
            <div className='p-4'>
              <h2 className='text-lg font-semibold mb-4'>Customers</h2>
              <div className='space-y-0'>
                {mockCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className='w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm'
                        style={{ backgroundColor: colors.primary }}
                      >
                        {customer.initial}
                      </div>
                      <span className='font-medium text-base text-gray-900'>
                        {customer.name}
                      </span>
                    </div>
                    <ChevronRight className='w-5 h-5 text-gray-400' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='flex border-t bg-white'>
            <div className='flex-1 text-center py-3 relative'>
              <div className='relative inline-block'>
                <BarChart3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
                <div
                  className='absolute -top-1 -right-2 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
                  style={{ backgroundColor: colors.primary, fontSize: '10px' }}
                >
                  8
                </div>
              </div>
              <span className='text-xs text-gray-400'>Jobs</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <HelpCircle className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Online Query</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <BarChart3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Power BI</span>
            </div>
            <div className='flex-1 text-center py-3 relative'>
              <Calendar className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <div
                className='absolute top-2 right-1/2 translate-x-4 text-xs px-1.5 py-0.5 rounded-full text-white font-bold'
                style={{ backgroundColor: colors.primary, fontSize: '10px' }}
              >
                0
              </div>
              <span className='text-xs text-gray-400'>Scheduled Actions</span>
            </div>
            <div className='flex-1 text-center py-3'>
              <Grid3X3 className='w-6 h-6 mx-auto mb-1 text-gray-400' />
              <span className='text-xs text-gray-400'>Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section Detail Preview */}
      <div className='bg-white rounded-xl shadow-lg border'>
        <div className='bg-gray-50 px-4 py-2 border-b'>
          <h3 className='font-semibold text-sm'>Section Detail</h3>
        </div>
        <div className='bg-gray-50 flex flex-col relative'>
          <div className='flex items-center justify-between p-4 bg-white border-b'>
            <div className='flex items-center space-x-2'>
              <ArrowLeft className='w-5 h-5 text-gray-700' />
              <span className='font-medium text-base'>Back</span>
            </div>
            <div className='flex items-center space-x-3'>
              <Search className='w-5 h-5 text-gray-600' />
              <Bell className='w-5 h-5 text-gray-600' />
            </div>
          </div>

          <div className='flex bg-white border-b'>
            <button
              className='px-6 py-3 font-medium border-b-2 text-base'
              style={{
                color: colors.primary,
                borderBottomColor: colors.primary
              }}
            >
              Sections
            </button>
            <button className='px-6 py-3 text-gray-500 text-base'>
              History
            </button>
            <button className='px-6 py-3 text-gray-500 text-base'>
              Resources
            </button>
          </div>

          <div className='flex-1 p-4 pb-20'>
            <h1 className='text-xl font-bold mb-1'>[KD] Signature & Radio</h1>
            <div className='text-sm text-gray-600 mb-6'>
              <span>Customers</span>
              <ChevronRight className='w-4 h-4 inline mx-1' />
              <MoreHorizontal className='w-4 h-4 inline' />
              <ChevronRight className='w-4 h-4 inline mx-1' />
              <span>AA. Heathervale House</span>
              <ChevronRight className='w-4 h-4 inline mx-1' />
              <span>CTUK_AA_1</span>
            </div>

            <div
              className='border-2 border-dashed rounded-lg p-8 mb-6'
              style={{ borderColor: colors.primary }}
            >
              <div className='text-center'>
                <div
                  className='text-2xl mb-2'
                  style={{ color: colors.primary }}
                >
                  +
                </div>
                <span
                  className='text-base font-medium'
                  style={{ color: colors.primary }}
                >
                  Start a New Flow
                </span>
              </div>
            </div>

            <div className='mb-6'>
              <h2 className='text-lg font-semibold mb-4'>Last 5 Flows</h2>
              <div className='space-y-3'>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 bg-white rounded-lg border'
                  >
                    <div className='flex items-center space-x-3'>
                      <div
                        className='w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm'
                        style={{ backgroundColor: colors.primary }}
                      >
                        A
                      </div>
                      <div>
                        <div className='font-medium text-base'>
                          [AG] Info Label
                        </div>
                        <div className='text-sm text-gray-500'>
                          {index === 0
                            ? '12/02/25 • 10:57'
                            : index === 1
                              ? '12/02/25 • 10:54'
                              : '12/02/25 • 10:53'}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className='w-5 h-5 text-gray-400' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='absolute bottom-4 right-4'>
            <button
              className='w-14 h-14 rounded-full text-white shadow-lg flex items-center justify-center text-2xl'
              style={{ backgroundColor: colors.primary }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
