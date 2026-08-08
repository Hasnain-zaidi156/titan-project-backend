import { Icon, ICONS } from "./Icon";
import { permissionGroupsForRole, roleSlug } from "../../constants/permissions";

export function ProfilePage({ user, onLogout }) {
  return (
    <div className="ta-profile-page">
      <div className="ta-profile-top-row">
        <h2 className="ta-profile-title">
          <Icon path={ICONS.user} size={18} />
          Profile Information
        </h2>
        <button className="ta-btn-primary ta-profile-logout-btn" onClick={onLogout}>
          <Icon path={ICONS.refresh} size={15} />
          Logout
        </button>
      </div>

      <div className="ta-profile-field-block">
        <label>Email</label>
        <p>{user?.email}</p>
      </div>

      <div className="ta-profile-field-block">
        <label>Role</label>
        <span className="ta-role-pill-outline">{roleSlug(user?.role)}</span>
      </div>

      <div className="ta-profile-grid-row">
        <div>
          <label><Icon path={ICONS.building} size={13} /> Country</label>
          <p>Pakistan</p>
        </div>
        <div>
          <label><Icon path={ICONS.building} size={13} /> City</label>
          <p>Sukkur</p>
        </div>
        <div>
          <label><Icon path={ICONS.building} size={13} /> Campus</label>
          <p>Saylani TITAN Sukkur Campus</p>
        </div>
      </div>

      <h3 className="ta-permissions-title">
        <Icon path={ICONS.shield} size={15} />
        Permissions
      </h3>

      {permissionGroupsForRole(user?.role).map((g) => (
        <div key={g.key} className="ta-permission-row">
          <p className="ta-permission-key">{g.key}</p>
          <div className="ta-permission-badges">
            {g.perms.map((p) => (
              <span key={p} className="ta-permission-badge">{p}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
