import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, CheckCircle, Clock, AlertTriangle, MessageSquare, FileText, Video, Image, Settings, Eye, Edit, Plus } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'marketing_manager' | 'content_creator' | 'graphic_designer' | 'video_editor' | 'social_media_manager' | 'copywriter';
  avatar?: string;
  status: 'active' | 'inactive';
  tasksAssigned: number;
  tasksCompleted: number;
  lastActive: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'content_creation' | 'design' | 'video_editing' | 'campaign_setup' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  createdAt: string;
  completedAt?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'review' | 'completed';
  progress: number;
  teamMembers: string[];
  dueDate: string;
  createdAt: string;
}

const TeamCollaborationTab: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'team' | 'tasks' | 'projects'>('team');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [membersResponse, tasksResponse, projectsResponse] = await Promise.all([
      //   fetch('/api/v1/marketing/team/members'),
      //   fetch('/api/v1/marketing/team/tasks'),
      //   fetch('/api/v1/marketing/team/projects')
      // ]);
      
      // Mock data for demonstration
      const mockMembers: TeamMember[] = [
        {
          id: 'member-1',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@wiremi.com',
          role: 'marketing_manager',
          avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150',
          status: 'active',
          tasksAssigned: 12,
          tasksCompleted: 8,
          lastActive: new Date().toISOString()
        },
        {
          id: 'member-2',
          name: 'Mike Chen',
          email: 'mike.chen@wiremi.com',
          role: 'graphic_designer',
          avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
          status: 'active',
          tasksAssigned: 8,
          tasksCompleted: 6,
          lastActive: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 'member-3',
          name: 'Emma Davis',
          email: 'emma.davis@wiremi.com',
          role: 'content_creator',
          avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
          status: 'active',
          tasksAssigned: 10,
          tasksCompleted: 7,
          lastActive: new Date(Date.now() - 1800000).toISOString()
        },
        {
          id: 'member-4',
          name: 'Alex Rodriguez',
          email: 'alex.rodriguez@wiremi.com',
          role: 'video_editor',
          status: 'active',
          tasksAssigned: 6,
          tasksCompleted: 4,
          lastActive: new Date(Date.now() - 7200000).toISOString()
        }
      ];

      const mockTasks: Task[] = Array.from({ length: 15 }, (_, i) => ({
        id: `task-${i + 1}`,
        title: [
          'Create social media graphics for summer campaign',
          'Write blog post about virtual cards',
          'Edit promotional video for mobile app',
          'Design email newsletter template',
          'Review AI-generated content for approval',
          'Set up Google Ads campaign',
          'Create Instagram story templates',
          'Write product announcement copy',
          'Design landing page graphics',
          'Edit customer testimonial video'
        ][i % 10],
        description: 'Detailed task description...',
        type: ['content_creation', 'design', 'video_editing', 'campaign_setup', 'review'][i % 5] as any,
        priority: ['low', 'medium', 'high', 'urgent'][i % 4] as any,
        status: ['todo', 'in_progress', 'review', 'completed'][i % 4] as any,
        assignedTo: mockMembers[i % mockMembers.length].id,
        assignedBy: 'member-1',
        dueDate: new Date(Date.now() + (i + 1) * 86400000).toISOString(),
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        completedAt: i % 4 === 3 ? new Date(Date.now() - i * 1800000).toISOString() : undefined
      }));

      const mockProjects: Project[] = [
        {
          id: 'project-1',
          name: 'Q2 Marketing Campaign',
          description: 'Comprehensive marketing campaign for Q2 product launches',
          status: 'active',
          progress: 65,
          teamMembers: ['member-1', 'member-2', 'member-3'],
          dueDate: '2024-06-30T00:00:00Z',
          createdAt: '2024-04-01T00:00:00Z'
        },
        {
          id: 'project-2',
          name: 'Brand Refresh Initiative',
          description: 'Update brand guidelines and marketing materials',
          status: 'planning',
          progress: 25,
          teamMembers: ['member-1', 'member-2'],
          dueDate: '2024-08-15T00:00:00Z',
          createdAt: '2024-05-01T00:00:00Z'
        }
      ];

      setTeamMembers(mockMembers);
      setTasks(mockTasks);
      setProjects(mockProjects);
    } catch (error) {
      console.error('Failed to load team data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      marketing_manager: 'bg-purple-100 text-purple-800',
      content_creator: 'bg-blue-100 text-blue-800',
      graphic_designer: 'bg-green-100 text-green-800',
      video_editor: 'bg-red-100 text-red-800',
      social_media_manager: 'bg-pink-100 text-pink-800',
      copywriter: 'bg-indigo-100 text-indigo-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStatusBadge = (status: string) => {
    const colors = {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      review: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'content_creation':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'design':
        return <Image className="w-4 h-4 text-green-500" />;
      case 'video_editing':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'campaign_setup':
        return <Settings className="w-4 h-4 text-purple-500" />;
      case 'review':
        return <Eye className="w-4 h-4 text-orange-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatRole = (role: string) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getMemberById = (id: string) => {
    return teamMembers.find(member => member.id === id);
  };

  return (
    <div className="space-y-6">
      {/* Team Collaboration Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Team Collaboration & Workflow</h3>
            <p className="text-indigo-100">Coordinate marketing team activities, manage tasks, and track project progress</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{teamMembers.filter(m => m.status === 'active').length}</div>
            <div className="text-sm text-indigo-100">Active Team Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'in_progress').length}</div>
            <div className="text-sm text-indigo-100">Tasks In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</div>
            <div className="text-sm text-indigo-100">Active Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">92%</div>
            <div className="text-sm text-indigo-100">On-Time Completion</div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'team', label: 'Team Members', icon: Users },
              { id: 'tasks', label: 'Task Management', icon: CheckCircle },
              { id: 'projects', label: 'Projects', icon: Calendar }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeView === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeView === 'team' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                  Marketing Team Members
                </h4>
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <UserPlus size={16} className="mr-2" />
                  Add Team Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          member.name.split(' ').map(n => n[0]).join('')
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-dark-100">
                          {member.name}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-dark-400">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(member.role)}`}>
                          {formatRole(member.role)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-dark-400">Tasks Completed:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100">
                          {member.tasksCompleted}/{member.tasksAssigned}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${(member.tasksCompleted / member.tasksAssigned) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-dark-400">Last Active:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100">
                          {new Date(member.lastActive).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {member.status}
                      </span>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                          <MessageSquare size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeView === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                  Task Management
                </h4>
                <button
                  onClick={() => setShowCreateTaskModal(true)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Create Task
                </button>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Task
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Assigned To
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                      {tasks.map((task) => {
                        const assignedMember = getMemberById(task.assignedTo);
                        return (
                          <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {getTaskIcon(task.type)}
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                                    {task.title}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-dark-400 capitalize">
                                    {task.type.replace(/_/g, ' ')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {assignedMember?.name.split(' ').map(n => n[0]).join('') || 'U'}
                                </div>
                                <span className="text-sm text-gray-900 dark:text-dark-100">
                                  {assignedMember?.name || 'Unassigned'}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(task.priority)}`}>
                                {task.priority}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskStatusBadge(task.status)}`}>
                                {task.status.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                              {formatDate(task.dueDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                                  <Eye size={16} />
                                </button>
                                <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                                  <Edit size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeView === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                  Marketing Projects
                </h4>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                  <Plus size={16} className="mr-2" />
                  Create Project
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                        {project.name}
                      </h5>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-dark-400 text-sm mb-4">
                      {project.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-dark-400">Progress:</span>
                          <span className="font-medium text-gray-900 dark:text-dark-100">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-400">Team Members:</span>
                        <div className="flex -space-x-2">
                          {project.teamMembers.slice(0, 3).map((memberId, index) => {
                            const member = getMemberById(memberId);
                            return (
                              <div key={index} className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white">
                                {member?.name.split(' ').map(n => n[0]).join('') || 'U'}
                              </div>
                            );
                          })}
                          {project.teamMembers.length > 3 && (
                            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white">
                              +{project.teamMembers.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-400">Due Date:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100">
                          {formatDate(project.dueDate)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Add Team Member
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Team member invitation form will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create New Task
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Task creation form will be implemented here with fields for title, description, assignee, priority, and due date.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateTaskModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCollaborationTab;