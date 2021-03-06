USE [master]
GO
/****** Object:  Database [ChatApp]    Script Date: 2019-01-13 13:53:17 ******/
CREATE DATABASE [ChatApp]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'ChatApp', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\ChatApp.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'ChatApp_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\ChatApp_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [ChatApp] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [ChatApp].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [ChatApp] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [ChatApp] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [ChatApp] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [ChatApp] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [ChatApp] SET ARITHABORT OFF 
GO
ALTER DATABASE [ChatApp] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [ChatApp] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [ChatApp] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [ChatApp] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [ChatApp] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [ChatApp] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [ChatApp] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [ChatApp] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [ChatApp] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [ChatApp] SET  ENABLE_BROKER 
GO
ALTER DATABASE [ChatApp] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [ChatApp] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [ChatApp] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [ChatApp] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [ChatApp] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [ChatApp] SET READ_COMMITTED_SNAPSHOT ON 
GO
ALTER DATABASE [ChatApp] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [ChatApp] SET RECOVERY FULL 
GO
ALTER DATABASE [ChatApp] SET  MULTI_USER 
GO
ALTER DATABASE [ChatApp] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [ChatApp] SET DB_CHAINING OFF 
GO
ALTER DATABASE [ChatApp] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [ChatApp] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [ChatApp] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'ChatApp', N'ON'
GO
ALTER DATABASE [ChatApp] SET QUERY_STORE = OFF
GO
USE [ChatApp]
GO
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [ChatApp]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 2019-01-13 13:53:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoleClaims]    Script Date: 2019-01-13 13:53:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 2019-01-13 13:53:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](450) NOT NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[Name] [nvarchar](256) NULL,
	[NormalizedName] [nvarchar](256) NULL,
 CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 2019-01-13 13:53:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 2019-01-13 13:53:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](450) NOT NULL,
	[ProviderKey] [nvarchar](450) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 2019-01-13 13:53:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](450) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 2019-01-13 13:53:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](450) NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[Email] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[UserName] [nvarchar](256) NULL,
 CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserTokens]    Script Date: 2019-01-13 13:53:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserTokens](
	[UserId] [nvarchar](450) NOT NULL,
	[LoginProvider] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Messages]    Script Date: 2019-01-13 13:53:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Messages](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Text] [nvarchar](max) NOT NULL,
	[TimeSent] [datetime2](7) NOT NULL,
	[SenderId] [nvarchar](450) NOT NULL,
	[RecipientId] [nvarchar](450) NULL,
	[RoomId] [int] NOT NULL,
 CONSTRAINT [PK_Messages] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RoomMember]    Script Date: 2019-01-13 13:53:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RoomMember](
	[RoomId] [int] NOT NULL,
	[MemberId] [nvarchar](450) NOT NULL,
	[JoinedAt] [datetime2](7) NOT NULL,
 CONSTRAINT [PK_RoomMember] PRIMARY KEY CLUSTERED 
(
	[RoomId] ASC,
	[MemberId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Rooms]    Script Date: 2019-01-13 13:53:18 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Rooms](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[OwnerId] [nvarchar](450) NULL,
 CONSTRAINT [PK_Rooms] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'00000000000000_CreateIdentitySchema', N'2.0.3-rtm-10026')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20181229220905_MessagesAndRooms', N'2.2.0-rtm-35687')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20181229221119_MessageSenderRequired', N'2.2.0-rtm-35687')
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20190109171240_RoomOwnerNotRequired', N'2.2.0-rtm-35687')
INSERT [dbo].[AspNetRoles] ([Id], [ConcurrencyStamp], [Name], [NormalizedName]) VALUES (N'e6e9789d-132e-4b5e-939c-ec4760ecc5b4', N'5fb327ff-96b2-463e-9700-51a2ee5d6b28', N'Administrator', N'ADMINISTRATOR')
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'32030f8f-a383-4c23-b11d-26cc651662d5', N'e6e9789d-132e-4b5e-939c-ec4760ecc5b4')
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'68144a21-c740-41c3-97be-40b323cb0f52', N'e6e9789d-132e-4b5e-939c-ec4760ecc5b4')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'32030f8f-a383-4c23-b11d-26cc651662d5', 0, N'562b31ba-06b2-40f5-b3b3-394dc76c896b', N'aa@a.aa', 0, 1, NULL, N'AA@A.AA', N'AA', N'AQAAAAEAACcQAAAAEJx8CqATurBhfAisWLfgwJ0mJJWX27BpFAl69krKcv8lM4GH41DZLJX9jZeXcJIajg==', N'+1234567890', 0, N'C6ZY7V2OUTJ26JLSSIALRB4MGBKV5HAO', 1, N'aa')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'38908ff5-29a1-4cbd-95c3-ca7083b83f46', 0, N'83bf823e-e3aa-4fc5-b667-710c413bf1ea', N'c@c.cc', 0, 1, NULL, N'C@C.CC', N'CC', N'AQAAAAEAACcQAAAAEBEbsoLXN5jX3Ob85gG4WXe8z2bFQgqbBf0qKEjDgvatdv2j8XTzNlzB+pA9UtK+Wg==', NULL, 0, N'CYKP3OZTG55XKKL7JJYP6YKKLRMLXI3S', 0, N'cc')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'3ac729d8-d760-469d-b7b5-eb888068e4d0', 0, N'54fcdf33-01a6-4713-bbe6-e66d93f71a09', N'e@e.ee', 0, 1, NULL, N'E@E.EE', N'EE', N'AQAAAAEAACcQAAAAEEpHtproitb2PRuMl9XwtB30oZvqDdXq3qYypxiNvyiTNOB0zYajAGaDk4mEXlb6QA==', NULL, 0, N'S4EPMLZZLYHYUJ5U4C2D2UCI2GHGYHNM', 0, N'ee')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'64418455-9e3a-478c-9f6f-34d408d8edda', 0, N'00c69b92-3f40-49a8-8a9d-bf53a7d19df6', N'alex.dimitrov.bg@hotmail.com', 0, 1, NULL, N'ALEX.DIMITROV.BG@HOTMAIL.COM', N'ALEX.DIMITROV.BG@HOTMAIL.COM', NULL, NULL, 0, N'Z4VVZG3OP6ROXLILGR3MKS4DEWHNIPPY', 0, N'alex.dimitrov.bg@hotmail.com')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'68144a21-c740-41c3-97be-40b323cb0f52', 0, N'b64a3d83-dc8f-4e9f-a5bc-e85cb65542ba', N'admin@mysite.com', 0, 1, NULL, N'ADMIN@MYSITE.COM', N'ADMIN@MYSITE.COM', N'AQAAAAEAACcQAAAAEFBO1X+5BJBMG8+VMMlHTQLV+HYnZRVk5yEK/hP3IJ+gvOL7GWImW8TbyMxX6zGS7Q==', NULL, 0, N'UNUTO5JPYKG3NODW5CJ3YJGIIWXJHJPT', 0, N'admin@mysite.com')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', 0, N'6aefcb73-690d-47c7-b9fd-3d05b85ef8cc', N'b@b.bb', 0, 1, NULL, N'B@B.BB', N'BB', N'AQAAAAEAACcQAAAAECW0VNV28Pln3De3D1onmjCagSSIzHr7nSOYa8EuKoi6Y72erJ0lNE2fZ8cJuX/4Iw==', NULL, 0, N'LO34UQ3IWJP46BIBJ6J7OQYBEDDKHBDH', 0, N'bb')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'a92fa97a-b418-483f-987a-f4d2fca8c946', 0, N'3e8a67ea-4bb2-4b00-a9a1-f1404a313438', N'd@d.dd', 0, 1, NULL, N'D@D.DD', N'DD', N'AQAAAAEAACcQAAAAEOXqhXoFZM1Vb8dqTSoobaT4VhG31ponO/znFQjv/CNcR+bTCi8175rai0oqLeMA4Q==', NULL, 0, N'KL72O4RN3Y7L5PYK5KCXO3CW7HMK7PJA', 0, N'dd')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'afdc9805-f798-4950-9652-4d5eae1b8078', 0, N'fbeecaa7-7414-46b0-a6ee-2dc12762d34d', N'aaaaaa@gmail.com', 0, 1, NULL, N'AAAAAA@GMAIL.COM', N'AAAAAA@GMAIL.COM', NULL, NULL, 0, N'X3DOBJPYBVSLS6R52YDKOZE7U4XHDWFM', 0, N'aaaaaa@gmail.com')
INSERT [dbo].[AspNetUsers] ([Id], [AccessFailedCount], [ConcurrencyStamp], [Email], [EmailConfirmed], [LockoutEnabled], [LockoutEnd], [NormalizedEmail], [NormalizedUserName], [PasswordHash], [PhoneNumber], [PhoneNumberConfirmed], [SecurityStamp], [TwoFactorEnabled], [UserName]) VALUES (N'fadb2a61-7659-490d-a7c4-3a53d1978392', 0, N'5e35aa7c-0bed-424b-a775-d001a52cbd16', N'alex.dimitrov.bg@gmail.com', 0, 1, NULL, N'ALEX.DIMITROV.BG@GMAIL.COM', N'ALEX.DIMITROV.BG@GMAIL.COM', NULL, NULL, 0, N'2MSVH2GGR7MR3EX7LLCATRX45E5SAIPA', 0, N'alex.dimitrov.bg@gmail.com')
INSERT [dbo].[AspNetUserTokens] ([UserId], [LoginProvider], [Name], [Value]) VALUES (N'32030f8f-a383-4c23-b11d-26cc651662d5', N'[AspNetUserStore]', N'AuthenticatorKey', N'3XCMOYC6QVYQUSYC75PI4RVZSSMZVDPY')
INSERT [dbo].[AspNetUserTokens] ([UserId], [LoginProvider], [Name], [Value]) VALUES (N'32030f8f-a383-4c23-b11d-26cc651662d5', N'[AspNetUserStore]', N'RecoveryCodes', N'7cc7f02c;ebc46bfc;ce423b53;170e4437;e7e904e6;c080ea06;848b2bc0;ca5f3d94;ff4f1a98;1b8e3751')
SET IDENTITY_INSERT [dbo].[Messages] ON 

INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (1, N'Hello All!', CAST(N'2019-01-11T10:58:30.1468783' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (2, N'Hi BB', CAST(N'2019-01-11T20:18:14.2877092' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (3, N'Hi there', CAST(N'2019-01-11T20:21:05.8922521' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (4, N'Hello', CAST(N'2019-01-11T21:03:57.8496215' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (5, N'Hi', CAST(N'2019-01-11T21:05:35.1361749' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (6, N'Hiii', CAST(N'2019-01-11T21:08:53.5507940' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (7, N'Hiiiiiii', CAST(N'2019-01-11T21:09:16.6158152' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (8, N'Hi AA', CAST(N'2019-01-11T21:31:32.8719893' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (9, N'Hi public!', CAST(N'2019-01-11T21:37:02.8434643' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (10, N'Hi Hi', CAST(N'2019-01-11T21:37:51.9815874' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (11, N'Wow', CAST(N'2019-01-11T21:40:07.4663248' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (12, N'vnghngn', CAST(N'2019-01-11T21:45:07.7232062' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (13, N'vbn ghgmn', CAST(N'2019-01-11T21:45:14.5528223' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (14, N'nfgnfg', CAST(N'2019-01-11T22:04:05.0728048' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (15, N'vb vbn n n', CAST(N'2019-01-11T22:04:08.4431945' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (16, N'nnfgnfn', CAST(N'2019-01-11T22:04:31.3065169' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (17, N'heeeeey', CAST(N'2019-01-11T22:04:41.4518735' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (18, N'here', CAST(N'2019-01-11T22:04:47.6759168' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (19, N'bn n', CAST(N'2019-01-11T22:05:33.8452335' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (20, N'hgnghnghn gdn', CAST(N'2019-01-11T22:05:37.1169187' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (21, N'ghn dghghddghn', CAST(N'2019-01-11T22:05:39.5316263' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (22, N'dhndghngdn', CAST(N'2019-01-11T22:05:41.0997142' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (23, N'gghn ghn mgdn', CAST(N'2019-01-11T22:06:04.9713480' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (24, N'cvc  fgnfgnfgn', CAST(N'2019-01-12T12:05:57.2444387' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (25, N'aaaaaa', CAST(N'2019-01-12T12:07:12.8943336' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (26, N'db dfbdb', CAST(N'2019-01-12T12:24:26.2921403' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (27, N'fgfgbsbnfgbfg', CAST(N'2019-01-12T12:24:32.3992758' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (28, N'fgnfgsnfsn', CAST(N'2019-01-12T12:54:55.5628418' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (29, N'fgnfhnfjhn', CAST(N'2019-01-12T12:55:02.0460394' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (30, N'sfnfnfn', CAST(N'2019-01-12T12:55:06.5335954' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (31, N'Hi guys', CAST(N'2019-01-12T19:58:23.8034931' AS DateTime2), N'a92fa97a-b418-483f-987a-f4d2fca8c946', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (32, N'Hi all', CAST(N'2019-01-12T20:00:09.1105467' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (35, N'Hi CC', CAST(N'2019-01-12T21:12:33.9954448' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (36, N'CCC', CAST(N'2019-01-12T21:14:22.8374372' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (46, N'xvmghmnghm', CAST(N'2019-01-12T22:13:14.6911075' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (47, N'uykfyhkfyhkfyhuyjhyh,', CAST(N'2019-01-12T22:20:45.0107068' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (48, N'h,h,f', CAST(N'2019-01-12T22:25:40.4278106' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (49, N'o;io;i;i;', CAST(N'2019-01-12T22:25:50.6436161' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (50, N'o;lio;o;io;', CAST(N'2019-01-12T22:26:19.1316542' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (51, N'ukyukuyky', CAST(N'2019-01-12T22:27:03.5472099' AS DateTime2), N'38908ff5-29a1-4cbd-95c3-ca7083b83f46', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (52, N'uykyukyky', CAST(N'2019-01-12T22:27:08.7955370' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (53, N'ujhkujuykluyk', CAST(N'2019-01-12T22:27:13.0842127' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (54, N'uykuyyukyu', CAST(N'2019-01-12T22:27:18.5208351' AS DateTime2), N'38908ff5-29a1-4cbd-95c3-ca7083b83f46', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (55, N'ukuykuykuy', CAST(N'2019-01-12T22:27:30.3793042' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (56, N'ukuukuyk', CAST(N'2019-01-12T22:27:33.0257937' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (57, N'uykuykuy', CAST(N'2019-01-12T22:27:38.6487440' AS DateTime2), N'38908ff5-29a1-4cbd-95c3-ca7083b83f46', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (58, N'nnfgn', CAST(N'2019-01-12T22:30:55.3096391' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (59, N'hnjhmnfg', CAST(N'2019-01-12T22:30:59.9023795' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (60, N'gnfgnfg', CAST(N'2019-01-12T22:31:26.7382853' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 24)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (61, N'ghnfgnff', CAST(N'2019-01-12T22:31:31.4356627' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 24)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (63, N'ghmghmg', CAST(N'2019-01-12T22:32:25.8894297' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (64, N'ftfgjmnfg', CAST(N'2019-01-12T22:32:33.8023011' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (65, N'kukukukuy', CAST(N'2019-01-12T22:32:44.5067562' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (66, N'][', CAST(N'2019-01-12T22:33:03.5366069' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (67, N'][', CAST(N'2019-01-12T22:33:03.7533835' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (68, N'[lp''i[''p[', CAST(N'2019-01-12T22:33:07.4039586' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (69, N'p[', CAST(N'2019-01-12T22:33:19.1149857' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (70, N'''i[p', CAST(N'2019-01-12T22:33:19.3638007' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (71, N'p', CAST(N'2019-01-12T22:33:22.3953170' AS DateTime2), N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', NULL, 1)
INSERT [dbo].[Messages] ([Id], [Text], [TimeSent], [SenderId], [RecipientId], [RoomId]) VALUES (72, N'o', CAST(N'2019-01-12T22:33:24.8732485' AS DateTime2), N'32030f8f-a383-4c23-b11d-26cc651662d5', NULL, 1)
SET IDENTITY_INSERT [dbo].[Messages] OFF
INSERT [dbo].[RoomMember] ([RoomId], [MemberId], [JoinedAt]) VALUES (1, N'32030f8f-a383-4c23-b11d-26cc651662d5', CAST(N'2019-01-12T22:33:01.3392257' AS DateTime2))
INSERT [dbo].[RoomMember] ([RoomId], [MemberId], [JoinedAt]) VALUES (1, N'38908ff5-29a1-4cbd-95c3-ca7083b83f46', CAST(N'2019-01-12T22:26:55.3725532' AS DateTime2))
INSERT [dbo].[RoomMember] ([RoomId], [MemberId], [JoinedAt]) VALUES (1, N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', CAST(N'2019-01-12T22:33:15.1245198' AS DateTime2))
INSERT [dbo].[RoomMember] ([RoomId], [MemberId], [JoinedAt]) VALUES (1, N'a92fa97a-b418-483f-987a-f4d2fca8c946', CAST(N'2019-01-12T19:59:53.4638286' AS DateTime2))
INSERT [dbo].[RoomMember] ([RoomId], [MemberId], [JoinedAt]) VALUES (24, N'8f84d720-dfb7-4e25-a9f5-b511ac95a988', CAST(N'2019-01-12T22:31:10.8608001' AS DateTime2))
SET IDENTITY_INSERT [dbo].[Rooms] ON 

INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (1, N'Public', NULL)
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (2, N'Room 1', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (3, N'Room 2', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (4, N'Room 3', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (20, N'f2erce', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (21, N'2erfe', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (22, N'cf2e', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (23, N'frf', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (24, N'2', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (25, N'fref', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (26, N'r', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (27, N'fr', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (28, N'f2erce2er', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (29, N'fef', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (30, N'ff', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (31, N'gbv4tbt4vbt4', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (32, N'rgvrvvr', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (33, N'rt', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (34, N'gvbrtvbrtv', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (35, N'nfsnfg', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (36, N'dfbdfbn', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (37, N'fbdfbdfb', N'32030f8f-a383-4c23-b11d-26cc651662d5')
INSERT [dbo].[Rooms] ([Id], [Name], [OwnerId]) VALUES (38, N'dfbdfbfdb', N'32030f8f-a383-4c23-b11d-26cc651662d5')
SET IDENTITY_INSERT [dbo].[Rooms] OFF
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetRoleClaims_RoleId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_AspNetRoleClaims_RoleId] ON [dbo].[AspNetRoleClaims]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [RoleNameIndex]    Script Date: 2019-01-13 13:53:19 ******/
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [dbo].[AspNetRoles]
(
	[NormalizedName] ASC
)
WHERE ([NormalizedName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserClaims_UserId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserClaims_UserId] ON [dbo].[AspNetUserClaims]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserLogins_UserId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserLogins_UserId] ON [dbo].[AspNetUserLogins]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_AspNetUserRoles_RoleId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_AspNetUserRoles_RoleId] ON [dbo].[AspNetUserRoles]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [EmailIndex]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [EmailIndex] ON [dbo].[AspNetUsers]
(
	[NormalizedEmail] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UserNameIndex]    Script Date: 2019-01-13 13:53:19 ******/
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers]
(
	[NormalizedUserName] ASC
)
WHERE ([NormalizedUserName] IS NOT NULL)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Messages_RecipientId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_Messages_RecipientId] ON [dbo].[Messages]
(
	[RecipientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
/****** Object:  Index [IX_Messages_RoomId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_Messages_RoomId] ON [dbo].[Messages]
(
	[RoomId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Messages_SenderId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_Messages_SenderId] ON [dbo].[Messages]
(
	[SenderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_RoomMember_MemberId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_RoomMember_MemberId] ON [dbo].[RoomMember]
(
	[MemberId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_Rooms_OwnerId]    Script Date: 2019-01-13 13:53:19 ******/
CREATE NONCLUSTERED INDEX [IX_Rooms_OwnerId] ON [dbo].[Rooms]
(
	[OwnerId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[AspNetRoleClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetRoleClaims] CHECK CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserTokens]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserTokens] CHECK CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_AspNetUsers_RecipientId] FOREIGN KEY([RecipientId])
REFERENCES [dbo].[AspNetUsers] ([Id])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_AspNetUsers_RecipientId]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_AspNetUsers_SenderId] FOREIGN KEY([SenderId])
REFERENCES [dbo].[AspNetUsers] ([Id])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_AspNetUsers_SenderId]
GO
ALTER TABLE [dbo].[Messages]  WITH CHECK ADD  CONSTRAINT [FK_Messages_Rooms_RoomId] FOREIGN KEY([RoomId])
REFERENCES [dbo].[Rooms] ([Id])
GO
ALTER TABLE [dbo].[Messages] CHECK CONSTRAINT [FK_Messages_Rooms_RoomId]
GO
ALTER TABLE [dbo].[RoomMember]  WITH CHECK ADD  CONSTRAINT [FK_RoomMember_AspNetUsers_MemberId] FOREIGN KEY([MemberId])
REFERENCES [dbo].[AspNetUsers] ([Id])
GO
ALTER TABLE [dbo].[RoomMember] CHECK CONSTRAINT [FK_RoomMember_AspNetUsers_MemberId]
GO
ALTER TABLE [dbo].[RoomMember]  WITH CHECK ADD  CONSTRAINT [FK_RoomMember_Rooms_RoomId] FOREIGN KEY([RoomId])
REFERENCES [dbo].[Rooms] ([Id])
GO
ALTER TABLE [dbo].[RoomMember] CHECK CONSTRAINT [FK_RoomMember_Rooms_RoomId]
GO
ALTER TABLE [dbo].[Rooms]  WITH CHECK ADD  CONSTRAINT [FK_Rooms_AspNetUsers_OwnerId] FOREIGN KEY([OwnerId])
REFERENCES [dbo].[AspNetUsers] ([Id])
GO
ALTER TABLE [dbo].[Rooms] CHECK CONSTRAINT [FK_Rooms_AspNetUsers_OwnerId]
GO
USE [master]
GO
ALTER DATABASE [ChatApp] SET  READ_WRITE 
GO
